/** URL affichable pour la photo patient (fichier uploadé ou URL externe legacy). */
export function getPatientPhotoUrl(photo: string | null | undefined): string | null {
  if (!photo?.trim()) return null;
  const value = photo.trim();
  if (value.startsWith('http://') || value.startsWith('https://') || value.startsWith('data:')) {
    return value;
  }
  return value.startsWith('/') ? value : `/${value}`;
}
