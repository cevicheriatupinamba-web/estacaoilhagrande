import { useState } from "react";
import { Upload, X, Film, Crown } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";
import {
  uploadListingPhoto,
  uploadListingVideo,
  PLAN_MEDIA_LIMITS,
  MEDIA_LIMITS,
  type ListingPlan,
} from "@/lib/listings-api";

export interface PlanMediaUploaderHandle {
  uploadPendingPhotos: (userId: string) => Promise<string[]>;
  uploadPendingVideos: (userId: string) => Promise<string[]>;
}

interface Props {
  plan: ListingPlan;
  existingPhotos: string[];
  existingVideos: string[];
  newPhotos: File[];
  newVideos: File[];
  onChangeExistingPhotos: (v: string[]) => void;
  onChangeExistingVideos: (v: string[]) => void;
  onChangeNewPhotos: (v: File[]) => void;
  onChangeNewVideos: (v: File[]) => void;
  disabled?: boolean;
}

const PlanMediaUploader = ({
  plan,
  existingPhotos,
  existingVideos,
  newPhotos,
  newVideos,
  onChangeExistingPhotos,
  onChangeExistingVideos,
  onChangeNewPhotos,
  onChangeNewVideos,
  disabled,
}: Props) => {
  const limits = PLAN_MEDIA_LIMITS[plan];
  const [previews, setPreviews] = useState<string[]>(() => newPhotos.map(f => URL.createObjectURL(f)));

  const totalPhotos = existingPhotos.length + newPhotos.length;
  const totalVideos = existingVideos.length + newVideos.length;

  const handlePhotos = (list: FileList | null) => {
    if (!list) return;
    const accepted: File[] = [];
    for (const f of Array.from(list)) {
      if (!MEDIA_LIMITS.photoTypes.includes(f.type)) {
        toast.error(`"${f.name}": formato não suportado. Use JPG, PNG ou WEBP.`);
        continue;
      }
      if (f.size > MEDIA_LIMITS.maxPhotoMb * 1024 * 1024) {
        toast.error(`"${f.name}": maior que ${MEDIA_LIMITS.maxPhotoMb}MB.`);
        continue;
      }
      accepted.push(f);
    }
    const space = limits.photos - totalPhotos;
    if (accepted.length > space) {
      toast.error(`Este plano permite até ${limits.photos} fotos e ${limits.videos} vídeo${limits.videos === 1 ? "" : "s"}.`);
    }
    const toAdd = accepted.slice(0, Math.max(0, space));
    onChangeNewPhotos([...newPhotos, ...toAdd]);
    setPreviews(p => [...p, ...toAdd.map(f => URL.createObjectURL(f))]);
  };

  const handleVideos = (list: FileList | null) => {
    if (!list) return;
    if (limits.videos === 0) {
      toast.error("Este plano não permite envio de vídeos. Faça upgrade para Destaque ou Premium.");
      return;
    }
    const accepted: File[] = [];
    for (const f of Array.from(list)) {
      if (!MEDIA_LIMITS.videoTypes.includes(f.type)) {
        toast.error(`"${f.name}": formato não suportado. Use MP4, MOV ou WEBM.`);
        continue;
      }
      if (f.size > MEDIA_LIMITS.maxVideoMb * 1024 * 1024) {
        toast.error(`"${f.name}": maior que ${MEDIA_LIMITS.maxVideoMb}MB.`);
        continue;
      }
      accepted.push(f);
    }
    const space = limits.videos - totalVideos;
    if (accepted.length > space) {
      toast.error(`Este plano permite até ${limits.videos} vídeo${limits.videos === 1 ? "" : "s"}.`);
    }
    onChangeNewVideos([...newVideos, ...accepted.slice(0, Math.max(0, space))]);
  };

  const removeExistingPhoto = (i: number) =>
    onChangeExistingPhotos(existingPhotos.filter((_, idx) => idx !== i));
  const removeNewPhoto = (i: number) => {
    onChangeNewPhotos(newPhotos.filter((_, idx) => idx !== i));
    setPreviews(p => p.filter((_, idx) => idx !== i));
  };
  const moveExistingPhotoUp = (i: number) => {
    if (i === 0) return;
    const a = [...existingPhotos];
    [a[i - 1], a[i]] = [a[i], a[i - 1]];
    onChangeExistingPhotos(a);
  };
  const removeExistingVideo = (i: number) =>
    onChangeExistingVideos(existingVideos.filter((_, idx) => idx !== i));
  const removeNewVideo = (i: number) =>
    onChangeNewVideos(newVideos.filter((_, idx) => idx !== i));

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-amber-400/40 bg-gradient-to-r from-amber-50 to-background dark:from-amber-500/10 dark:to-background p-4 flex items-start gap-3">
        <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-400 text-foreground shrink-0">
          <Crown className="w-4 h-4" />
        </span>
        <div className="text-sm">
          <p className="font-semibold text-foreground">
            Plano {plan === "gratuito" ? "Básico" : plan === "destaque" ? "Destaque" : "Premium"} · {limits.label}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            Formatos: JPG, PNG, WEBP (até {MEDIA_LIMITS.maxPhotoMb}MB)
            {limits.videos > 0 ? ` • MP4, MOV, WEBM (até ${MEDIA_LIMITS.maxVideoMb}MB)` : ""}.
          </p>
        </div>
      </div>

      {/* Fotos */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <Label className="font-semibold">Fotos</Label>
          <span className="text-xs text-muted-foreground">{totalPhotos} / {limits.photos}</span>
        </div>

        {existingPhotos.length > 0 && (
          <>
            <p className="text-xs text-muted-foreground mb-2">
              Fotos atuais — clique no <strong>X</strong> para remover ou <strong>↑</strong> para promover à capa.
            </p>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mb-3">
              {existingPhotos.map((src, i) => (
                <div key={src} className="relative aspect-square rounded-xl overflow-hidden border border-border group">
                  <img src={src} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => removeExistingPhoto(i)}
                    aria-label="Remover foto"
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-foreground/80 text-background flex items-center justify-center hover:bg-destructive transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                  {i > 0 && (
                    <button
                      type="button"
                      disabled={disabled}
                      onClick={() => moveExistingPhotoUp(i)}
                      aria-label="Mover para capa"
                      className="absolute top-1 left-1 px-1.5 h-6 rounded-full bg-foreground/80 text-background text-[10px] font-bold"
                    >
                      ↑
                    </button>
                  )}
                  {i === 0 && (
                    <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-primary text-primary-foreground text-[9px] font-bold uppercase">Capa</span>
                  )}
                </div>
              ))}
            </div>
          </>
        )}

        <label className={cn(
          "flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-2xl p-6 cursor-pointer transition",
          totalPhotos >= limits.photos
            ? "border-border bg-muted/30 cursor-not-allowed opacity-60"
            : "border-border hover:border-primary hover:bg-primary/5"
        )}>
          <Upload className="w-6 h-6 text-muted-foreground" />
          <span className="text-sm text-muted-foreground text-center">
            {totalPhotos >= limits.photos
              ? `Limite de ${limits.photos} fotos atingido`
              : "Clique para adicionar fotos"}
          </span>
          <input
            type="file"
            accept={MEDIA_LIMITS.photoTypes.join(",")}
            multiple
            className="hidden"
            disabled={disabled || totalPhotos >= limits.photos}
            onChange={e => { handlePhotos(e.target.files); e.currentTarget.value = ""; }}
          />
        </label>

        {previews.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2 mt-3">
            {previews.map((src, i) => (
              <div key={src} className="relative aspect-square rounded-xl overflow-hidden border border-primary/40">
                <img src={src} alt={`Nova foto ${i + 1}`} className="w-full h-full object-cover" />
                <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-primary text-primary-foreground text-[9px] font-bold uppercase">Nova</span>
                <button
                  type="button"
                  disabled={disabled}
                  onClick={() => removeNewPhoto(i)}
                  aria-label="Remover foto"
                  className="absolute top-1 right-1 w-6 h-6 rounded-full bg-foreground/80 text-background flex items-center justify-center hover:bg-destructive transition"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Vídeos */}
      {limits.videos > 0 ? (
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label className="font-semibold">Vídeos</Label>
            <span className="text-xs text-muted-foreground">{totalVideos} / {limits.videos}</span>
          </div>

          {existingVideos.length > 0 && (
            <ul className="space-y-2 mb-3">
              {existingVideos.map((url, i) => (
                <li key={url} className="flex items-center gap-3 rounded-xl border border-border bg-background p-2.5">
                  <Film className="w-4 h-4 text-primary shrink-0" />
                  <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm truncate flex-1 hover:underline">
                    Vídeo {i + 1}
                  </a>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => removeExistingVideo(i)}
                    aria-label="Remover vídeo"
                    className="w-7 h-7 rounded-full bg-muted hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}

          <label className={cn(
            "flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-2xl p-6 cursor-pointer transition",
            totalVideos >= limits.videos
              ? "border-border bg-muted/30 cursor-not-allowed opacity-60"
              : "border-border hover:border-primary hover:bg-primary/5"
          )}>
            <Film className="w-6 h-6 text-muted-foreground" />
            <span className="text-sm text-muted-foreground text-center">
              {totalVideos >= limits.videos
                ? `Limite de ${limits.videos} vídeo${limits.videos > 1 ? "s" : ""} atingido`
                : "Clique para adicionar vídeos"}
            </span>
            <input
              type="file"
              accept={MEDIA_LIMITS.videoTypes.join(",")}
              multiple
              className="hidden"
              disabled={disabled || totalVideos >= limits.videos}
              onChange={e => { handleVideos(e.target.files); e.currentTarget.value = ""; }}
            />
          </label>

          {newVideos.length > 0 && (
            <ul className="mt-3 space-y-2">
              {newVideos.map((f, i) => (
                <li key={i} className="flex items-center gap-3 rounded-xl border border-primary/40 bg-background p-2.5">
                  <Film className="w-4 h-4 text-primary shrink-0" />
                  <span className="text-sm truncate flex-1">{f.name}</span>
                  <span className="text-xs text-muted-foreground shrink-0">{(f.size / 1024 / 1024).toFixed(1)} MB</span>
                  <button
                    type="button"
                    disabled={disabled}
                    onClick={() => removeNewVideo(i)}
                    aria-label="Remover vídeo"
                    className="w-7 h-7 rounded-full bg-muted hover:bg-destructive hover:text-destructive-foreground flex items-center justify-center transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-border p-4 text-xs text-muted-foreground">
          O envio de vídeos está disponível nos planos <strong>Destaque</strong> e <strong>Premium</strong>.
        </div>
      )}
    </div>
  );
};

export const uploadPendingMedia = async (
  userId: string,
  newPhotos: File[],
  newVideos: File[]
): Promise<{ photoUrls: string[]; videoUrls: string[] }> => {
  const photoUrls: string[] = [];
  for (const f of newPhotos) photoUrls.push(await uploadListingPhoto(f, userId));
  const videoUrls: string[] = [];
  for (const f of newVideos) videoUrls.push(await uploadListingVideo(f, userId));
  return { photoUrls, videoUrls };
};

export default PlanMediaUploader;
