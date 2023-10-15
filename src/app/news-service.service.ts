import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { NewsItem } from './news-item.model'; // Importez l'interface depuis le fichier correspondant

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  constructor(private firestore: AngularFirestore) {}

  getNews(): Observable<NewsItem[]> { // Utilisez l'interface pour définir le type de retour
    return this.firestore.collection<NewsItem>('ANNONCES').valueChanges();
  }


  addNews(newsItem: NewsItem): Promise<any> { // Utilisez l'interface pour définir le type du paramètre
    return this.firestore.collection('ANNONCES').add(newsItem);
  }
}

