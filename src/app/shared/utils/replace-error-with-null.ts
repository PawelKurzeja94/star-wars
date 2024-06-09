import { HttpErrorResponse } from '@angular/common/http';
import { of } from 'rxjs';

export const replaceHttpErrorWithNull = (error: HttpErrorResponse) => of(null);
