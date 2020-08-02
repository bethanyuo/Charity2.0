import { Component, ViewChild, NgZone, OnInit } from '@angular/core';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import * as _ from 'lodash';
import { MatDialog } from '@angular/material/dialog';
import { DappService } from 'src/app/services/dapp.service';

@Component({
  selector: 'app-request-list',
  templateUrl: './request-list.component.html',
  styleUrls: ['./request-list.component.scss']
})
export class RequestListComponent implements OnInit {
  public displayedColumns: string[] = ['timestamp', 'state', 'reward', 'cautionAmount', 'detailsBtn'];
  private requests: any[] = [];
  public areDataLoaded = false;
  public dataSource: MatTableDataSource<any>;

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  constructor(private zone: NgZone, public dialog: MatDialog, private dappService: DappService) {
    this.dappService.loadRequests().then(requests => {
      this.requests = _.orderBy(requests, ['timestamp'], ['desc']);
      this.dataSource = new MatTableDataSource(this.requests);
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }).finally(() => this.areDataLoaded = true);
  }

  ngOnInit(): void {
  }

}
