"use client";

/**
 * Pad de signature dessinée — alternative à l'upload image (B2 2026-05-02).
 *
 * L'utilisateur dessine sa signature directement dans le navigateur via
 * souris / trackpad / stylet / doigt sur tablette. À l'enregistrement, le
 * canvas est exporté en PNG (fond blanc, trait noir) et envoyé à la même
 * server action `uploadSignatureImage` que le drop zone — donc même
 * pipeline serveur (détourage + auto-crop) → même résultat dans le PDF.
 *
 * Important : le canvas est rempli en BLANC opaque dès l'init. Si on le
 * laissait transparent, le pipeline `processSignatureForPdf` (qui suppose
 * une image scannée fond papier) échouerait : sharp.greyscale() compose les
 * pixels alpha=0 sur fond noir par défaut, le diff devient incohérent.
 *
 * Implémentation pointer events (vs mouse/touch séparés) : 1 seul handler
 * gère souris + touch + stylet, plus simple et compatible iPad/Surface.
 */

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { uploadSignatureImage } from "@/app/profil/actions";

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 220;
const STROKE_WIDTH = 3;
const STROKE_COLOR = "#000000";
const BACKGROUND_COLOR = "#FFFFFF";

export default function SignaturePadCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [hasDrawing, setHasDrawing] = useState(false);
  const isDrawingRef = useRef(false);

  // Init du canvas : taille adaptée au device pixel ratio (rendu net sur
  // écrans Retina) + fond blanc opaque + style trait.
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    canvas.width = CANVAS_WIDTH * dpr;
    canvas.height = CANVAS_HEIGHT * dpr;
    canvas.style.width = `${CANVAS_WIDTH}px`;
    canvas.style.height = `${CANVAS_HEIGHT}px`;
    ctx.scale(dpr, dpr);

    // Fond blanc opaque (cf. commentaire d'en-tête)
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Style trait
    ctx.strokeStyle = STROKE_COLOR;
    ctx.lineWidth = STROKE_WIDTH;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
  }, []);

  function getCanvasPoint(e: React.PointerEvent<HTMLCanvasElement>): {
    x: number;
    y: number;
  } {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.setPointerCapture(e.pointerId);
    isDrawingRef.current = true;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const point = getCanvasPoint(e);
    ctx.beginPath();
    ctx.moveTo(point.x, point.y);
    // Tracer un point unique pour qu'un click sans drag laisse une marque
    ctx.lineTo(point.x + 0.01, point.y + 0.01);
    ctx.stroke();

    if (!hasDrawing) setHasDrawing(true);
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawingRef.current) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const point = getCanvasPoint(e);
    ctx.lineTo(point.x, point.y);
    ctx.stroke();
  }

  function handlePointerUp(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawingRef.current) return;
    canvasRef.current?.releasePointerCapture(e.pointerId);
    isDrawingRef.current = false;
  }

  function handleClear() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = BACKGROUND_COLOR;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    setHasDrawing(false);
    setError(null);
  }

  function handleSave() {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawing) return;

    setError(null);
    canvas.toBlob((blob) => {
      if (!blob) {
        setError("Impossible d'enregistrer la signature.");
        return;
      }

      const file = new File([blob], "signature.png", { type: "image/png" });
      const formData = new FormData();
      formData.append("file", file);

      startTransition(async () => {
        const res = await uploadSignatureImage(formData);
        if (!res.ok) {
          setError(res.error);
          return;
        }
        router.refresh();
      });
    }, "image/png");
  }

  return (
    <div>
      <p className="text-[12px] uppercase tracking-[0.06em] text-jc-ink-muted mb-3">
        Dessinez votre signature
      </p>

      <div className="bg-white border border-jc-line-strong rounded-jc-sm p-2 inline-block">
        <canvas
          ref={canvasRef}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerCancel={handlePointerUp}
          className="touch-none cursor-crosshair"
          style={{ display: "block" }}
        />
      </div>

      <p className="text-[12px] text-jc-ink-muted mt-2">
        Utilisez votre souris, votre trackpad, ou un stylet/doigt sur tablette.
        Le fond sera rendu transparent automatiquement.
      </p>

      {error && (
        <p className="mt-3 text-[13px] text-red-700 bg-red-50 rounded p-2">
          {error}
        </p>
      )}

      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          disabled={isPending || !hasDrawing}
          onClick={handleClear}
          className="px-4 py-2 text-sm text-jc-ink-soft border border-jc-line-strong rounded-jc-sm hover:bg-jc-surface transition-colors disabled:opacity-50"
        >
          Effacer
        </button>
        <button
          type="button"
          disabled={isPending || !hasDrawing}
          onClick={handleSave}
          className="px-4 py-2 text-sm font-medium bg-jc-primary text-white rounded-jc-sm hover:bg-jc-primary-hover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPending ? "Enregistrement…" : "Enregistrer la signature"}
        </button>
      </div>
    </div>
  );
}
