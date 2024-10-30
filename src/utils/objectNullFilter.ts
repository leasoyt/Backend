export function filterNullFields(obj: any): any {
    return Object.fromEntries(
      Object.entries(obj).filter(([_, value]) => value !== null)
    );
  }