import { Html5Qrcode } from "html5-qrcode";

export interface QrCameraPreflight {
  cameraId?: string;
  permissionDenied: boolean;
}

/** Call from a button click — iOS Safari requires camera access inside the user gesture. */
export async function preflightQrCamera(): Promise<QrCameraPreflight> {
  if (!navigator.mediaDevices?.getUserMedia) {
    return { permissionDenied: true };
  }

  try {
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: { ideal: "environment" } },
    });
    stream.getTracks().forEach((track) => track.stop());
  } catch {
    return { permissionDenied: true };
  }

  try {
    const cameras = await Html5Qrcode.getCameras();
    if (cameras.length === 0) {
      return { permissionDenied: false };
    }

    const backCamera =
      cameras.find((camera) => /back|rear|environment/i.test(camera.label)) ??
      cameras[cameras.length - 1];

    return { cameraId: backCamera.id, permissionDenied: false };
  } catch {
    return { permissionDenied: false };
  }
}
