import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';

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
  vrednost = 0.1;
  grupa = "";
  vrstavrsta = "";
  novakategorija = "";
  vrstaIzplacila: any[] = ["izdatek", "prihodek"];
  izdatkiGrupe: any[] = [{"id":-1, "ime":"hrana"}];
  datum = this.formatDate(new Date());

  datumOD = this.formatDate(new Date());
  datumDO = this.formatDate(new Date());
  grupaFILTER = "";
  filterSTATUS = "";

  lihoDATUM = 0;
  lihoVREDNOST = 0;

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
      this.narisiGraf();
    });
  }

  ngOnInit(): void {
    this.pridobiKategorije();
    this.pridobiIzdatke();
  }

  public shraniIzdatek() {
    //shrani izdatek
    var vrsta = 1;
    if (this.vrstavrsta== "izdatek") {
      vrsta = -1;
    }

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
        if (this.grupaFILTER && this.izdatki[i].grupa != this.grupaFILTER || this.datumOD > this.izdatki[i].datum || this.datumDO < this.izdatki[i].datum) {
          this.izdatki.splice(i,1);
          i--;
        }
      }
      for (var i = 0; i < this.prihodki.length; i++) {
        if (this.grupaFILTER && this.prihodki[i].grupa != this.grupaFILTER || this.datumOD > this.prihodki[i].datum || this.datumDO < this.prihodki[i].datum) {
          this.prihodki.splice(i,1);
          i--;
        }
      }
      this.posodobiVrednost();
      this.narisiGraf();
    });
  }

  public swap(vrsta, i, j) {
    //zamenja i-ti in (i+1)-ti element v izdatkih(vrsta=0) ali prihodkih(vrsta=1)
    if (vrsta == 0) {var temp = this.izdatki[i];this.izdatki[i] = this.izdatki[j];this.izdatki[j] = temp;}
    else {var temp = this.prihodki[i];this.prihodki[i] = this.prihodki[j];this.prihodki[j] = temp;}
  }

  public urediPoDatumu(vrsta) {
    //vrsta označuje ali smo kliknili uredi po datumu pri izdatkih ali prihodkih
    //this.lihoDATUM nam pa pove če je številka klikov liha-1.uredimo padajoče, 2.naraščajoče
    var lenlen = this.izdatki.length;
    if (vrsta == 1) lenlen = this.prihodki.length;

    for (var i = 0; i < lenlen; i++) {
      for (var j = 0; j < lenlen; j++) {
        if (vrsta == 0) {
          var datum1 = this.izdatki[i].datum;
          var datum2 = this.izdatki[j].datum;
        }
        else {
          var datum1 = this.prihodki[i].datum;
          var datum2 = this.prihodki[j].datum;
        }
        if ((1 - this.lihoDATUM) && datum1 < datum2)
          this.swap(vrsta, i, j);
        else if (this.lihoDATUM && datum1 > datum2)
          this.swap(vrsta, i, j);
      }
    } this.lihoDATUM = 1-this.lihoDATUM;
  }

  public urediPoGrupi(vrsta) {
    //vrsta označuje ali smo kliknili uredi po grupi pri izdatkih ali prihodkih
    var lenlen = this.izdatki.length;
    if (vrsta == 1) lenlen = this.prihodki.length;

    for (var i = 0; i < lenlen; i++) {
      for (var j = 0; j < lenlen; j++) {
        if (vrsta == 0) {
          var grupa1 = this.izdatki[i].grupa;
          var grupa2 = this.izdatki[j].grupa;
        }
        else {
          var grupa1 = this.prihodki[i].grupa;
          var grupa2 = this.prihodki[j].grupa;
        }
        if (grupa1 < grupa2)
          this.swap(vrsta, i, j);
      }
    }
  }

  public urediPoVrednosti(vrsta) {
    //vrsta označuje ali smo kliknili uredi po grupi pri izdatkih ali prihodkih
    var lenlen = this.izdatki.length;
    if (vrsta == 1) lenlen = this.prihodki.length;
    for (var i = 0; i < lenlen; i++) {

      for (var j = 0; j < lenlen; j++) {
        if (vrsta == 0) {
          var vrednost1 = this.izdatki[i].vrednost;
          var vrednost2 = this.izdatki[j].vrednost;
        }
        else {
          console.log("heloooo");
          var vrednost1 = this.prihodki[i].vrednost;
          var vrednost2 = this.prihodki[j].vrednost;
        }
        if ((1 - this.lihoVREDNOST) && vrednost1 < vrednost2)
          this.swap(vrsta, i, j);
        else if (this.lihoVREDNOST && vrednost1 > vrednost2)
          this.swap(vrsta, i, j);
      }
    } this.lihoVREDNOST = 1-this.lihoVREDNOST;
  }


  //----
  public barChartOptions:any = {
    scaleShowVerticalLines: false,
    responsive: true
  };
  public labels:string[] = [];
  public barChartType:string = 'bar';

  public barData:any[] = [
    {data: [], label: 'Izdatki'},
    {data: [], label: 'Prihodki'}
  ];

  public narisiGraf() {
    this.barData[0].data = [];
    this.barData[1].data = [];
    this.labels = [];

    for (var i = 0; i < this.izdatki.length; i++) {
      var tempDatum = this.izdatki[i].datum.substring(0,4);
      //če leta še ni na seznamu ga dodamo
      if (this.labels.indexOf(tempDatum)==-1) {
        //če leta še ni na seznamu ga dodamo
        this.labels.push(tempDatum);
        this.barData[0].data.push(0);
        this.barData[1].data.push(0);
      }
      this.barData[0].data[this.labels.indexOf(tempDatum)] += this.izdatki[i].vrednost*(-1);
    }

    for (var i = 0; i < this.prihodki.length; i++) {
      var tempDatum = this.prihodki[i].datum.substring(0,4);
      if (this.labels.indexOf(tempDatum)==-1) {
        //če leta še ni na seznamu ga dodamo
        this.labels.push(tempDatum);
        this.barData[0].data.push(0);
        this.barData[1].data.push(0);
      }
      this.barData[1].data[this.labels.indexOf(tempDatum)] += this.prihodki[i].vrednost;
    }

  }
  //-----


}
