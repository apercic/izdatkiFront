import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {RequestOptions} from "@angular/http";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  message = "";
  title = "";
  izdatki = [];
  prihodki = [];
  skupnoIzdatki = 0;
  skupnoPrihodki = 0;
  ime = "";
  vrednost = 0;
  grupa = "";
  vrstavrsta = "";
  novakategorija = "";
  vrstaIzplacila: any[] = ["izdatek", "prihodek"];
  izdatkiGrupe: any[] = [{"id":-1, "ime":"hrana"}];
  datum = this.formatDate(new Date());

  datumOD = this.formatDate(new Date());
  datumDO = this.formatDate(new Date());
  grupaFILTER = this.izdatkiGrupe[0];
  filterSTATUS = "";

  constructor(private http: HttpClient){}

  public formatDate(date) {
      //formatira datum
      var d = new Date(date),month=''+(d.getMonth()+1),day=''+d.getDate(),year=d.getFullYear();
      if (month.length<2) month='0'+month;
      if (day.length<2) day='0'+day;
      return [year, month, day].join('-');
  }

  public posodobiVrednost() {
    //posodobi vrednost skupnih izdatkov
    this.skupnoIzdatki = 0;
    this.skupnoPrihodki = 0;

    for (var i = 0; i < this.izdatki.length; i++)
      this.skupnoIzdatki += this.izdatki[i].vrednost;
    for (var i = 0; i < this.prihodki.length; i++)
       this.skupnoPrihodki += this.prihodki[i].vrednost;
  }

  public pridobiKategorije() {
    //iz serverja dobiš kategorije
    this.http.get('http://localhost:8080/getKategorije').subscribe((data:any) => {
      if(data.length) this.izdatkiGrupe = data;
      else return;

      this.grupaFILTER = this.izdatkiGrupe[0].ime;

      if (!this.grupa) this.grupa = this.izdatkiGrupe[0].ime;
      if(!this.vrstavrsta) this.vrstavrsta = this.vrstaIzplacila[0];
    });
  }

  public pridobiIzdatke() {
   //iz baze dobi, sortira izdatke/prihodke
   this.izdatki = [];
   this.prihodki = [];

    this.http.get('http://localhost:8080/get').subscribe((data:any) => {
      for (var i=0; i<data.length; i++) {
        if (data[i].vrednost < 0)
          this.izdatki.push(data[i]);
        else
          this.prihodki.push(data[i]);
      }
      this.posodobiVrednost();
      return 0;
    });
  }

  ngOnInit(): void {
    this.pridobiKategorije();
    this.pridobiIzdatke();
  }

  public shraniIzdatek() {
    //shrani izdatek
    var vrsta = 1;
    if (this.vrstavrsta== "izdatek")
      vrsta = -1;

    this.http.post('http://localhost:8080/save', {
     "datum":this.datum.toString(),
     "grupa":this.grupa,
     "vrednost":this.vrednost*vrsta
    }).subscribe(data => {
      this.ngOnInit();
    });
  }

   public zbrisi(izdatek) {
    //zbriše izdatek
    this.http.request('DELETE','http://localhost:8080/delete',
      {body: izdatek}).subscribe(data => {
      this.ngOnInit();
    });
  }

  public shraniKategorijo() {
    //shrani novo kategorijo
    if (!this.novakategorija) return;

    this.http.post('http://localhost:8080/saveKategorija', {
      "ime":this.novakategorija
    }).subscribe(data => {
      this.pridobiKategorije();
    });
  }

  public filtriraj() {
    //preverimo če sta datuma OD-DO ustrezno nastavljena
    if(this.datumOD > this.datumDO) {
      this.filterSTATUS = "Datum OD mora biti manši ali enak datumu DO.";
      return;
    }
    //preverimo če sta datuma nastavljena
    //najprej pridobi vse podatke, potem jih pa filtrira
    this.izdatki = [];
    this.prihodki = [];

    this.http.get('http://localhost:8080/get').subscribe((data:any) => {
      //dobiš podatke o izdatkih iz serverja
      for (var i=0; i<data.length; i++) {
        if (data[i].vrednost < 0) this.izdatki.push(data[i]);
        else this.prihodki.push(data[i]);
      }

      //filtriraš podatke po grupi in datumu
      for (var i = 0; i < this.izdatki.length; i++) {
        if (this.izdatki[i].grupa != this.grupaFILTER || this.datumOD > this.izdatki[i].datum || this.datumDO < this.izdatki[i].datum) {
          this.izdatki.splice(i,1);
          i--;
        }
      }
      for (var i = 0; i < this.prihodki.length; i++) {
        if (this.prihodki[i].grupa != this.grupaFILTER || this.datumOD > this.prihodki[i].datum || this.datumDO < this.prihodki[i].datum) {
          this.prihodki.splice(i,1);
          i--;
        }
      }
      this.posodobiVrednost();
    });
  }

}
