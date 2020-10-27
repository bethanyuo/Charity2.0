import { Component, ViewChild, NgZone, OnInit } from '@angular/core';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import * as _ from 'lodash';
import { DappService } from 'src/app/services/dapp.service';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-pending-requests',
  templateUrl: './pending-requests.component.html',
  styleUrls: ['./pending-requests.component.scss']
})
export class PendingRequestsComponent implements OnInit {
  public displayedColumns: string[] = ['charity', 'urgent', 'reward'];
  private requests: any[] = [];
  public areDataLoaded = false;
  public dataSource: MatTableDataSource<any>;
  private subscription = new Subscription();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private dappService: DappService, 
    private zone: NgZone
    ) {
    this.listenForPendingRequests();
  }

  private listenForPendingRequests(): void {
    //const subscription = this.contractorForm.onSubmit().subscribe(contractorName => {
    const subscription = this.dappService.filteredData.subscribe(contractorName => {
      this.zone.run(() => {
        this.dappService.loadPendingRequests(contractorName).then(requests => {
          this.requests = _.orderBy(requests, ['timestamp'], ['desc']);
          this.dataSource = new MatTableDataSource(this.requests);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        }).finally(() => this.areDataLoaded = true);
      });
    });
    this.subscription.add(subscription);
  }

  ngOnInit(): void {
  }

}
