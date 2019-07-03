import {Injectable, OnInit} from '@angular/core';
import {P2PBid} from './data-types/P2PBid';
import {Prosumer} from './data-types/Prosumer';
import {BCTransaction} from './data-types/BCTransaction';
import { Subject} from 'rxjs';
import {TimeService} from './time.service';
import {P2PMarketDesign} from './data-types/P2PMarketDesign';
import {MockEDMService} from './mock-edm.service';
import {ExperimentInstance} from './data-types/ExperimentInstance';
import {DataProvisionService} from './data-provision.service';

@Injectable({
  providedIn: 'root'
})
export class BlockchainTransactionService {
  private freeBidId = 5;
  private mockBids: P2PBid[] = [
    {
      id: 1,
      provider: {id: 1},
      deliveryTime: 81,
      duration: 3,
      price: 2,
      power: 1.5
    },
    {
      id: 2,
      provider: {id: 1},
      deliveryTime: 12,
      duration: 2,
      price: 1.6,
      power: 1.5
    },
    {
      id: 3,
      provider: {id: 1},
      deliveryTime: 33,
      duration: 1,
      price: 2.2,
      power: 1.5
    },
    {
      id: 4,
      provider: {id: 1},
      deliveryTime: 13,
      duration: 2,
      price: 2.1,
      power: 1.5
    }
  ];
  private committedBids: P2PBid[] = [];
  private openBids: P2PBid[] = this.mockBids;
  public committedBidSubject: Subject<P2PBid> = new Subject<P2PBid>();
  public openBidSubject: Subject<P2PBid[]> = new Subject<P2PBid[]>();
  private transactions: BCTransaction[] = [];
  private p2pMarketDesign: P2PMarketDesign;

  constructor(private timeService: TimeService,
              private edmService: MockEDMService,
              private data: DataProvisionService) {
    this.timeService.timeEmitter.subscribe(currentTime => {
      this.openBids = this.openBids.filter(currentBid => !this.bidExpired(currentBid));
      this.openBidSubject.next(this.openBids);
    });
    this.edmService.getP2PMarketDescription(data.experimentId).subscribe(p2pMarketDesign => this.p2pMarketDesign = p2pMarketDesign);
  }

  public commitToP2PBid(buyer: Prosumer, timeOfPurchase: number, committedBid: P2PBid) {
    this.transactions.push({author: buyer, p2pbid: committedBid, timestamp: timeOfPurchase});
    this.committedBids.push(committedBid);
    this.committedBidSubject.next(committedBid);
    this.openBids = (this.openBids.slice(0, this.openBids.indexOf(committedBid)).concat(this.openBids.slice(this.openBids.indexOf(committedBid) + 1, this.openBids.length)));
    this.openBidSubject.next(this.openBids);
    console.log(this.transactions);
    console.log(this.committedBids);
  }

  public getCommitedBids(): P2PBid[] { return this.committedBids; }
  public getOpenBids(): P2PBid[] { return this.openBids; }
  public getMockBids(): P2PBid[] { return this.mockBids; }

  getUnusedBidId(): number {
    this.freeBidId++;
    return (this.freeBidId - 1);
  }

  commitBid(bid: P2PBid): void {
    if (this.openBids.indexOf(bid) === - 1) {
      this.openBids.push(bid);
      this.openBidSubject.next(this.openBids);
    }
  }

  private bidExpired(currentBid: P2PBid) {
    if ((this.timeService.getCurrentTime() + this.p2pMarketDesign.bidClosure) > currentBid.deliveryTime) {
      return true;
    } else { return false; }
  }
}
