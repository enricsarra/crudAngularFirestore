import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Observable } from 'rxjs';

import { HeroeModel } from '../../models/heroe.model';
import { HeroesService } from '../../services/heroes.service';

import Swal from 'sweetalert2'; 

@Component({
  selector: 'app-heroe',
  templateUrl: './heroe.component.html',
  styleUrls: ['./heroe.component.css']
})
export class HeroeComponent implements OnInit {

  heroe: HeroeModel = new HeroeModel();

  constructor( private heroesService: HeroesService,
               private route: ActivatedRoute ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if ( id !== 'nuevo' ) {
       this.heroesService.getRegistro('heroes', id )
        .subscribe( (resp: any) => {
          // console.log('aaaaaaaaaa', resp);
          this.heroe= resp;
        });
        /* this.heroesService.getRegistro('heroes', id )
        .subscribe( (resp: HeroeModel) => {
          this.heroe = resp;
          this.heroe.id = id;
        }); */
    }
  }

  guardar( form: NgForm ) {
    if ( form.invalid ) {
      // console.log('*** Formulario no válido ***');

      // Marcamos todos los controles como tecleados para 
      // evitar que guardemos el formulario en blanco o sea, 
      // sin haber tecleado nada
      Object.values( form.controls ).forEach( control => {
        control.markAsTouched();
      });
      return;
    }

    Swal.fire({
      title: 'Espere',
      text: 'Guardando información',
      icon: 'info',
      allowOutsideClick: false
    });
    Swal.showLoading();

    let peticion;

    if ( this.heroe.id ) {
      peticion = this.heroesService.update( 'heroes', this.heroe );
    } else {
      peticion = this.heroesService.create( 'heroes', this.heroe );
    }
    peticion
     .then( resp => {
       Swal.fire('Gracias',`Inserción correcta del registro }`, 'success' );
      })
      .catch( err => {
        Swal.fire('Ooopss',`Error grabación { err } }`, 'error' )});


      // inicializamos  'heroe' para blanquear la pantalla
   
    if (!this.heroe.id ) {
       this.heroe = new HeroeModel();
      }
  }

}
