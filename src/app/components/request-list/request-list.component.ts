import { Component, ViewChild, NgZone, OnInit } from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { Web3Service } from 'src/app/services/web3.service';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss']
})
export class RequestListComponent implements OnInit {
  public displayedColumns: string[] = ['timestamp', 'state', 'reward', 'cautionAmount', 'detailsBtn'];
  private deliveries: any[] = [];
  public areDataLoaded = false;
  public dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private zone: NgZone, public dialog: MatDialog, private web3Serice: Web3Service) {
    // this.web3Serice.loadDeliveries().then(deliveries => {
    //   this.deliveries = _.orderBy(deliveries, ['timestamp'], ['desc']);
    //   this.dataSource = new MatTableDataSource(this.deliveries);
    //   this.dataSource.paginator = this.paginator;
    //   this.dataSource.sort = this.sort;
    // }).finally(() => this.areDataLoaded = true);
  }

  ngOnInit(): void {
  }

}
