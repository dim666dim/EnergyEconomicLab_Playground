import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { TimeRegime } from './data-types/TimeRegime';
import { Coordinates } from './data-types/Coordinates';
import { Prosumer } from './data-types/Prosumer';
import { ProsumerInstance } from './data-types/ProsumerInstance';
import { ControllableGenerator } from './data-types/ControllableGenerator';
import { NonControllableGenerator } from './data-types/NonControllableGenerator';
import { Load } from './data-types/Load';
import { StorageUnit } from './data-types/StorageUnit';
import { P2POption } from './data-types/P2POption';
import { P2PMarketDesign } from './data-types/P2PMarketDesign';
import { ExperimentDescription } from './data-types/ExperimentDescription';
import { TransactionFeeEntry } from './data-types/TransactionFeeEntry';
import { ExperimentInstance } from './data-types/ExperimentInstance';

@Injectable({
  providedIn: 'root'
})

// TODO load as randomized SLP
// TODO Strahlungsprofil?
// TODO Coordinates --> any reasonable thing here?

/**
 * Service to provide (stateless) data.
 * This service is predominantly used for providing mock data that will eventually be provided by the EDM service, and will be discarded at the latest in production.
 * Methods are all getter methods that provide mock data, so none will be documented further.
 * Stateful data (on the experiment) is provided by the experiment state service.
 */
export class DataProvisionService {
  maxBidSize = 10000;
  maxAskSize = 10000;
  private mockBids: P2POption[] = [
    {
      id: 1,
      optionCreator: this.getMockProsumerInstance(),
      deliveryTime: 81,
      duration: 3,
      price: 2,
      power: 1.5
    },
    {
      id: 2,
      optionCreator: this.getMockProsumerInstance(),
      deliveryTime: 12,
      duration: 2,
      price: 1.6,
      power: 1.5
    },
    {
      id: 3,
      optionCreator: this.getMockProsumerInstance(),
      deliveryTime: 33,
      duration: 1,
      price: 2.2,
      power: 1.5
    },
    {
      id: 4,
      optionCreator: this.getMockProsumerInstance(),
      deliveryTime: 13,
      duration: 2,
      price: 2.1,
      power: 1.5
    }
  ];

  private  mockAsks: P2POption[] = [
    {
      id: 1,
      optionCreator: this.getMockProsumerInstance(),
      deliveryTime: 81,
      duration: 3,
      price: 2,
      power: 1.5
    },
    {
      id: 2,
      optionCreator: this.getMockProsumerInstance(),
      deliveryTime: 12,
      duration: 2,
      price: 1.6,
      power: 1.5
    }
  ];

  constructor() { }

  static getExperimentLength(): Observable<number> {
    return of(120);
  }

  static getexperimentDesignLength(): Observable<number> {
    return of(168);
  }

  static getTimeRegime(): Observable<TimeRegime> {
    const regime = TimeRegime.DISCRETE;
    return of(regime);
  }

  static getTimeStepLength(): Observable<number> {
    const stepLength = 300;
    console.log('returning observable of stepLength');
    return of(stepLength);
  }

  static getCO2Price(): Observable<number[]> {
    const price = [0.2, 0.2, 0.4];
    return of(price);
  }

  static getGasPrice(): Observable<number[]> {
    const price = [0.2, 0.2, 0.4];
    return of(price);
  }

  static getPrognosisVisibilityScheme(): Observable<string> {
    return of('default');
  }

  static getScheduleVisibilityScheme(): Observable<string> {
    return of('default');
  }

  static getBidVisibilityScheme(): Observable<string> {
    return of('default');
  }

  static getRole(id: string): Observable<string> {
    if (parseInt(id, 10) < 10) { return of ('role1');
    } else {
      return of('role2'); }
  }

  static getP2PMarketDescription(experimentId: number): Observable<P2PMarketDesign> {
    return of({
      bidClosure: 5,
      askClosure: 5,
      timeSliceLength: 2,
      minBidSize: 0.5,
      minAskSize: 0.5,
      maxPrice: -1,
      feeAmount: .1
    });
  }

  static getP2PMarketDescriptionExperimentDesign(experimentId: number): Observable<P2PMarketDesign> {
    return of({
      bidClosure: 3,
      askClosure: 3,
      timeSliceLength: 1,
      minBidSize: 0,
      minAskSize: 0,
      maxPrice: -1,
      feeAmount: 0
    });
  }

  static getAccellerationFactor(): Observable<number> {
    const accellerationFactor = 10;
    return of(accellerationFactor);
  }

  static getCoordinates(): Coordinates {
    const x = 2.3;
    const y = 1.4;
    return {x, y};
  }

  /* static getStaticProsumers(): Prosumer[] {
    let prosumerArray: Prosumer[];
    prosumerArray = [
      { id: 1, name: 'Mr. Nice' },
      { id: 2, name: 'Hans'}
    ];
    return prosumerArray;
  }*/

  static getProsumerData(id = 1): Observable<ProsumerInstance> {
    let prosumerInstance: ProsumerInstance;
    prosumerInstance = new ProsumerInstance(
      new Prosumer(id, 'mock prosumer'),
      DataProvisionService.getControllableGenerators(),
      DataProvisionService.getNonControllableGenerators(),
      DataProvisionService.getLoads(),
      DataProvisionService.getStorages(),
      DataProvisionService.getCoordinates(),
      100);
    return of(prosumerInstance);
  }

  static getExperimentDescription(experimentType: number): ExperimentDescription {
    if (experimentType === 0) {
      return {
        prosumers: [],
        p2pMarketDesign: {
          bidClosure: 10,
          askClosure: 10,
          timeSliceLength: 1,
          minBidSize: 1,
          minAskSize: 1,
          maxPrice: 10000,
          feeAmount: .1
        },
        description: 'mock experiment description for type 0'
      };
    }
  }

  static getControllableGenerators(): ControllableGenerator[] {
    return [this.getCGenerator()];
  }

  static getNonControllableGenerators(): NonControllableGenerator[] {
    return [this.getNCGenerator()];
  }

  static getLoads(): Load[] {
    return [this.getLoad1(), this.getLoad2()];
  }

  static getRandomizedLoad(): Load {
    const model = 'Load1'; // TODO get good description for this?
    const relativeControllability = 0;
    const temporalShiftingCapability = 0;
    const load1 = new Load(model, relativeControllability, temporalShiftingCapability);
    this.getexperimentDesignLength().subscribe(length =>
      load1.initiateRandomizedSLP(length)); // TODO insert SLP?
    return load1;
  }

  static getStorages(): StorageUnit[] {
    return [this.getStorage()];
  }

  static getNCGenerator(): NonControllableGenerator {
    const pv =  new NonControllableGenerator('SolarPanel #3',
      4.1);
    this.getExperimentLength().subscribe(length => pv.initiateProjectedGeneration(length));
    return pv;
  }

  static getCGenerator(): ControllableGenerator {
    const model = 'controllable Generator #2';
    const maximalGeneration = 2.0;
    const minimalDowntime = 3;
    const minimalUptime = 4;
    const rampingParameter = 0.2;
    const cg2 = new ControllableGenerator(
      model,
      maximalGeneration,
      minimalDowntime,
      minimalUptime,
      rampingParameter
      );
    this.getExperimentLength().subscribe(length => cg2.initiateSchedule(length));
    return cg2;
  }

  static getLoad1(): Load {
    const model = 'Load1';
    const relativeControllability = 0.5;
    const temporalShiftingCapability = 5;
    const load1 = new Load(model, relativeControllability, temporalShiftingCapability);
    this.getExperimentLength().subscribe(length =>
    load1.initiateSchedule(length));
    return load1;
  }

  static getLoad2(): Load {
    const model = 'Load2';
    const relativeControllability = 0.1;
    const temporalShiftingCapability = 1;
    const load2 = new Load(model, relativeControllability, temporalShiftingCapability);
    this.getExperimentLength().subscribe(length =>
      load2.initiateSchedule(length));
    return load2;
  }

  static getStorage(): StorageUnit {
    const model = 'CoolStore';
    const storageCapacity = 2.1;
    const feedinPower = 0.3;
    const feedoutPower = 0.3;
    const cycleEfficiency = 0.9;
    const initialSOC = 0.2;
    const coolStore = new StorageUnit(model, storageCapacity, feedinPower, feedoutPower, cycleEfficiency, initialSOC);
    this.getExperimentLength().subscribe(length => coolStore.initiateSchedule(length));
    return coolStore;
  }

  getMockProsumerInstance(id = 1): ProsumerInstance {
    return new ProsumerInstance(
      new Prosumer(id, 'mock prosumer'),
      DataProvisionService.getControllableGenerators(),
      DataProvisionService.getNonControllableGenerators(),
      DataProvisionService.getLoads(),
      DataProvisionService.getStorages(),
      DataProvisionService.getCoordinates(),
      100);
  }

  // todo needs to be prosumer 1
  getMockProsumer1Instance(id = 1): ProsumerInstance {
    return new ProsumerInstance(
      new Prosumer(id, 'Prosumer1'),
      [],
      DataProvisionService.getNonControllableGenerators(),
      [],
      [],
      DataProvisionService.getCoordinates(),
      100
    );
  }

  getMockProsumer2Instance(id = 2): ProsumerInstance {
    return new ProsumerInstance(
      new Prosumer(id, 'Prosumer2'),
      [],
      DataProvisionService.getNonControllableGenerators(),
      [],
      DataProvisionService.getStorages(),
      DataProvisionService.getCoordinates(),
      100
    );
  }

  getMockProsumer3Instance(id = 3): ProsumerInstance {
    return new ProsumerInstance(
      new Prosumer(id, 'Prosumer3'),
      [],
      DataProvisionService.getNonControllableGenerators(),
      [],
      DataProvisionService.getStorages(),
      DataProvisionService.getCoordinates(),
      100
    );
  }

  getMockProsumer4Instance(id = 4): ProsumerInstance {
    return new ProsumerInstance(
      new Prosumer(id, 'Prosumer4'),
      [],
      [],
      [DataProvisionService.getRandomizedLoad()],
      [],
      DataProvisionService.getCoordinates(),
      100
    );
  }

  getMockProsumer5Instance(id = 5): ProsumerInstance {
    return new ProsumerInstance(
      new Prosumer(id, 'Prosumer5'),
      [],
      [],
      [DataProvisionService.getRandomizedLoad()],
      DataProvisionService.getStorages(),
      DataProvisionService.getCoordinates(),
      100
    );
  }

  getMockProsumer6Instance(id = 6): ProsumerInstance {
    return new ProsumerInstance(
      new Prosumer(id, 'Prosumer6'),
      [],
      [],
      [DataProvisionService.getRandomizedLoad()],
      [],
      DataProvisionService.getCoordinates(),
      100
    );
  }

  getMockProsumer7Instance(id = 7): ProsumerInstance {
    return new ProsumerInstance(
      new Prosumer(id, 'Prosumer7'),
      [],
      [],
      [DataProvisionService.getRandomizedLoad()],
      [],
      DataProvisionService.getCoordinates(),
      100
    );
  }

  getMaxBidSize() {
    return of(this.maxBidSize);
  }

  getMaxAskSize() {
    return of(this.maxAskSize);
  }

  getMockExperimentInstances(): Set<ExperimentInstance> {
    const collection: Set<ExperimentInstance> = new Set<ExperimentInstance>();
    const respectiveDescription: ExperimentDescription = DataProvisionService.getExperimentDescription(0);
    collection.add({experimentID: 0, instanceOfExperiment: respectiveDescription});
    collection.add({experimentID: 1, instanceOfExperiment: respectiveDescription});
    collection.add({experimentID: 2, instanceOfExperiment: respectiveDescription});
    collection.add({experimentID: 3, instanceOfExperiment: respectiveDescription});
    collection.add({experimentID: 4, instanceOfExperiment: respectiveDescription});
    collection.add({experimentID: 6, instanceOfExperiment: respectiveDescription});
    // console.log('about to return the collection ' + collection + ' with ' + collection.size + ' entries.');
    return collection;
  }

  public getMockBids(): P2POption[] { return this.mockBids; }

  public getMockAsks(): P2POption[] { return  this.mockAsks; }

  getMockPublicActorData(): Set<TransactionFeeEntry> {
    const feeEntries = new Set<TransactionFeeEntry>();
    this.mockBids.forEach(currentBid => {
      const entry = {payer: currentBid.optionCreator, amount: currentBid.price * 0.1, correspondingTransaction: currentBid};
      feeEntries.add(entry);
    });
    return feeEntries;
  }
}
