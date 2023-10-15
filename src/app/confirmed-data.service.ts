import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NewsService {
  constructor(private firestore: AngularFirestore) {}

  getNews(): Observable<any[]> {
    return this.firestore.collection('news').valueChanges();
  }

  addNews(newsItem: any): Promise<any> {
    return this.firestore.collection('news').add(newsItem);
  }
}
