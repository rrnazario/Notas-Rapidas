import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

export const nomeBanco = 'dbnotas';
export const versaoBanco = 1;
export const nomeStore = 'notas';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage {
  items: Array<string>;
  novaNota: string;  
  db: any; //Banco de dados

  nomeBanco = 'dbnotas';
  versaoBanco = 1;
  nomeStore = 'notas';

  constructor(public navCtrl: NavController) {
    this.items = new Array<string>();

    if (!window.indexedDB) {
      window.alert("Seu navegador não suporta uma versão estável do IndexedDB. Alguns recursos não estarão disponíveis.");
    }
  
    this.InicializaBanco();
    this.obtemNotasBanco();
  }

  InicializaBanco(){
    //substituir por mensagens do banco
    var request = window.indexedDB.open(nomeBanco, versaoBanco);

    request.onupgradeneeded = function () {
      // Criando outro objeto chamado "notas" com o autoIncrement setado.    
      request.result.createObjectStore(nomeStore, { autoIncrement : true });      
    }

    request.onsuccess = () => {
      console.log("Banco conectado com sucesso.");

      this.db = request.result;   
    };
  }
  
  obtemNotasBanco(){
    this.limpaLista();

    var request = window.indexedDB.open(nomeBanco, versaoBanco);

    request.onsuccess = () => {      

      var transaction = request.result.transaction(nomeStore, 'readwrite');
      var objectStore = transaction.objectStore(nomeStore);
  
      objectStore.getAll().onsuccess = (event) => {
        event.target.result.forEach(element => {
          this.items.push(element);  
        });
      };      
    };   
  }

  limpaLista(){
    this.items = new Array<string>();
  }

  addLista(){
    this.items.push(this.novaNota);    
    
    var request = window.indexedDB.open(nomeBanco, versaoBanco);
    request.onsuccess = () => {      

      var transaction = request.result.transaction(nomeStore, 'readwrite');
      var objectStore = transaction.objectStore(nomeStore); 

      var added = objectStore.add(this.novaNota);

      added.onsuccess = () => {
         console.log("Adicionado com sucesso!"); 
         this.novaNota = "";
      };
    }
    //Adicionar no banco de dados
    
  }

}
