import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { HeroeModel } from '../models/heroe.model';
import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import 'firebase/firestore';
import { map } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {

  private url = 'https://login-app-eef87.firebaseio.com';
  items: Observable<any[]>;
  constructor( private http: HttpClient,
               private db: AngularFirestore ) {

  }

  getCollection( collection ): Observable<any[]>  {
    return this.db.collection(`${ collection }`).snapshotChanges()
    .pipe(
      map((resp) => resp.map(e => ({id: e.payload.doc.id,
                                   ...e.payload.doc.data() as {}} )
           // Si no ponemos '....as {}'                        
       ))
    );
    

    /* .pipe(
      map((resp) => resp.map(e => {
        return {
          id: e.payload.doc.id,
          ...e.payload.doc.data()
        } ;
      }))
    ); */
  }

  create( collection, heroe: HeroeModel, ) {
    return this.db.collection<HeroeModel>(`${ collection}`).add({...heroe});
  }

  update( collection: string, heroe: HeroeModel ) {

    // console.log('collection ', collection, heroe.id);
    /* const heroeTemp = {
      ...heroe
    }; */

    // delete heroeTemp.id;
    return this.db.doc(`${ collection}/${ heroe.id }`).update( heroe );
    /* return this.db.collection(`${ collection}`).doc(`${ heroe }`).update( heroe ) */
  }

  delete( collection, id: string ) {

   return of(this.db.doc(`${ collection}/${ id }`).delete());
  }


  getRegistro( collection, id: string ) {
    return this.db.collection(`${ collection }`).doc(id).snapshotChanges()
    .pipe(
       map( e => ({id: e.payload.id, ...e.payload.data() as {}}))
       // Si no ponemos '....as {}'

      /* map((e) => {
        return {
          id: e.payload.id,
          ...e.payload.data()
        } ;
      }) */
    )
  }


  
  private crearArreglo( heroesObj: object ) {

    const heroes: HeroeModel[] = [];

    Object.keys( heroesObj ).forEach( key => {

      const heroe: HeroeModel = heroesObj[key];
      heroe.id = key;

      heroes.push( heroe );
    });


    return heroes;

  }

}
