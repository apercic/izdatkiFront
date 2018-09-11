import { Component} from '@angular/core';
import { IzdatkiService } from "../izdatki.service";
import { Chart } from 'chart.js';

@Component({
  selector: 'app-grafi',
  templateUrl: './grafi.component.html',
  styles: []
})
export class GrafiComponent  {

  constructor(private data: IzdatkiService) { }
  labels = [];
  izdatki = [];
  prihodki = [];
  type = 'line';
  line = "";
  bar  = "";
  gradient = "";
  model =  {options: '1'};

  ngOnInit(): void {
    this.onCheckCheckbox();
  }

  sort() {
    for (var i = 0; i < this.labels.length; i++) {
      for (var j = 0; j < this.labels.length; j++) {
        if (this.labels[i] < this.labels[j]) {
          var temp = this.labels[i]; this.labels[i]=this.labels[j]; this.labels[j]=temp;
          temp = this.izdatki[i]; this.izdatki[i]=this.izdatki[j]; this.izdatki[j] = temp;
          temp = this.prihodki[i]; this.prihodki[i]=this.prihodki[j]; this.prihodki[j] = temp;
        }
      }
    }
  }

  public onCheckCheckbox() {
    if (this.model.options == "1") this.type = "line";
    else this.type = "bar";
    this.narisiGraf();
  }



  public narisiGraf() {
  var options = {
    type: this.type,
    data: {
      labels: this.labels,
      datasets: [
  	    { label: 'Izdatki',
  	      data: this.izdatki,
        	borderWidth: 1,
        	backgroundColor: "pink"
      	},
  			{	label: 'Prihodki',
  				data: this.prihodki,
  				borderWidth: 1,
  				backgroundColor: "grey"
  			}
  		]
    },
    options: {scales: {yAxes: [{ticks: {reverse: false, beginAtZero: true}}]}}
  }

  this.data.servFunc().subscribe((data:any) => {
    for (var i = 0; i < data.length; i++) {
      var letnica = data[i].datum.substring(0,4);
      var indexLetnice = this.labels.indexOf(letnica);

      //če še ni tega leta med labels
      if (indexLetnice == -1) {
        this.labels.push(letnica);
        indexLetnice = this.labels.length-1;
        this.izdatki.push(0);
        this.prihodki.push(0);
      }
      if (data[i].vrednost < 0) this.izdatki[indexLetnice] += data[i].vrednost*(-1);
      else this.prihodki[indexLetnice] += data[i].vrednost;
    }

    //sortiramo podatke
    this.sort();

    var bb:any = document.getElementById('chartJSContainer');
    var ctx = bb.getContext('2d');
    new Chart(ctx, options);
  });





  }

}
