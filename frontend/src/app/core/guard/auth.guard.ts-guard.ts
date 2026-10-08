import { CanActivateFn } from '@angular/router';

export const authGuardTsGuard: CanActivateFn = (route, state) => {
  return true;
};
