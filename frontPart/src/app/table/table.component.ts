import {ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {FlnType} from "../models/flnType";
import {COLUMNS_FOR_TABLE} from "../models/tableColumns";
import {FlnTypesService, strangeURL} from "../services/fln-types.service";
import {Subscription} from "rxjs";
import {Table} from "primeng/table";

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements OnInit, OnDestroy{
  public flnTypesData: FlnType[];

  public columns = COLUMNS_FOR_TABLE;

  public url = strangeURL;

  public URN_VALUES: number[] = [];

  public inputUrl: string = '';

  private destroySubscription: Subscription | undefined;

  @ViewChild('table')
  private flnTypeTable?: Table;

  constructor(private flnTypeService: FlnTypesService, private detectionChange: ChangeDetectorRef) {
    this.flnTypesData = [];
    this.inputUrl = this.url;
  }

  ngOnInit() {
    this.destroySubscription = this.flnTypeService.getJsonData().subscribe(data => {
      this.flnTypesData = data;
      this.detectionChange.detectChanges();
    })
  }

  ngOnDestroy() {
    this.destroySubscription?.unsubscribe();
  }

  public applyFilterGlobal($event: Event, match: string): void{
    this.flnTypeTable?.filterGlobal(($event.target as HTMLInputElement).value, match);
  }

  public clearFilter() : void{
    this.URN_VALUES = [];
    this.setDefaultInputUrl();
    this.detectionChange.detectChanges();
  }

  public setDefaultInputUrl(){
    this.inputUrl = this.url;
  }

  public changeInputUrl(): void{
    this.inputUrl = this.url + this.URN_VALUES.join(',');
  }

  public addURNValue(valueURN: number): void{
    if(!this.URN_VALUES.includes(valueURN)) {
      this.URN_VALUES.push(valueURN);
      this.changeInputUrl();
      this.detectionChange.detectChanges();
    }
  }

  public copyToBuffer(){
    const stringToClipboard = this.url + this.URN_VALUES.join(',');
    navigator.clipboard.writeText(stringToClipboard).then(r => console.log(r));
  }

}
