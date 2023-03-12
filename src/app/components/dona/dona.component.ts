import { Component, Input } from '@angular/core';
import {  ChartData, ChartEvent, ChartType } from 'chart.js';


@Component({
  selector: 'app-dona',
  templateUrl: './dona.component.html',
  // styleUrls: ['./dona.component.css']
})
export class DonaComponent {

  doughnutChartLabels: string[] = ['label1', 'label2', 'label3'];
   @Input('data') doughnutChartData: ChartData<'doughnut'> = {
   labels: this.doughnutChartLabels,
   datasets: [ {  data: [ 350, 450, 100 ],
                  backgroundColor: ['#6857E6','#009FEE','#F02059'],
                  hoverBackgroundColor: ['#6857E6','#009FEE','#F02059'],
                  hoverBorderColor:['#000000','#000000','#00000003']
               },
             ]
 };
 public doughnutChartType: ChartType = 'doughnut';

 // events
 public chartClicked({ event, active }: { event: ChartEvent, active: {}[] }): void {
  console.log(event, active);
}

public chartHovered({ event, active }: { event: ChartEvent, active: {}[] }): void {
  console.log(event, active);
}
}
