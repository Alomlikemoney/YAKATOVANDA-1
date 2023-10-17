
import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NewsItems } from './new-items.model';

@Injectable({
  providedIn: 'root'
})
export class NewServiceSignService {

  constructor(private firestore: AngularFirestore) { }
  
  getNews(): Observable<NewsItems[]> { // Utilisez l'interface pour définir le type de retour
    return this.firestore.collection<NewsItems>('users').valueChanges();
  }


  addNews(newsItems: NewsItems): Promise<any> { // Utilisez l'interface pour définir le type du paramètre
    return this.firestore.collection('users').add(newsItems);
  }
}

