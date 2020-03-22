import { Component, OnInit } from '@angular/core';

import { AngularFirestore } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import 'firebase/firestore';

import { HeroesService } from '../../services/heroes.service';
import { HeroeModel } from '../../models/heroe.model';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})
export class HeroesComponent implements OnInit {

  heroes: HeroeModel[] = [];
  cargando = false;
  items: Observable<any[]>;


  constructor( private heroesService: HeroesService, 
               private db: AngularFirestore ) { }

  ngOnInit(): void {

    this.cargando = true;
    this.getHeroes();
  
    //  Ejemplo de utilizar un observable.Mejor solucion a la implementada. Ver en heroes.component.html (... async)
    this.items = this.db.collection('heroes').valueChanges();

  }

  getHeroes() {
    this.heroesService.getCollection('heroes')
    .subscribe ( registro => this.heroes = registro)
    this.cargando = false;
  }


  borrarHeroe( heroe: HeroeModel, i: number ) {

    Swal.fire({
      title: '¿Está seguro?',
      text: `Está seguro que desea borrar a ${ heroe.nombre }`,
      icon: 'question',
      showConfirmButton: true,
      showCancelButton: true
    }).then( resp => {

      if ( resp.value ) {
        // como delete devuelve una promesa,con el operador of
        //   la convierto en un observable
    
        this.heroesService.delete('heroes', heroe.id )
          .subscribe( resp => {
            Swal.fire('Ok',`Se eliminado el registro: ${ heroe.id }`, 'success' );
          })
          
      }

    });
  }


}
