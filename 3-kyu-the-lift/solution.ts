function pluckFromArray<T>(
  array: T[],
  filterFn: (value: T, array: T[], removed: T[]) => boolean
): T[] {
  const removed: T[] = [];
  for (let i = 0; i < array.length; i += 1) {
    const value = array[i];
    if (filterFn(value, array, removed)) {
      removed.push(value);
      array.splice(i, 1);
      i -= 1;
    }
  }

  return removed;
}

class Lift {
  private readonly capacity: number;
  private direction: -1 | 1 = 1;
  private currentFloor: number = 0;
  liftStops = [0];
  private stoppedAtCurrentFloor: boolean = false;
  private passengerDestinationFloors: number[] = [];
  private floorRequestQueues: number[][];
  private floorsWithRequests: Set<number>;

  constructor(capacity: number, floorRequestQueues: number[][]) {
    this.capacity = capacity;
    this.floorRequestQueues = floorRequestQueues;
    this.floorsWithRequests = new Set(
      floorRequestQueues.flatMap((queue, floor) => (queue.length > 0 ? [floor] : []))
    );
  }

  start() {
    this.move();
  }

  private get isLiftEmpty(): boolean {
    return !this.passengerDestinationFloors.length;
  }

  private get remainingLiftCapacity(): number {
    return this.capacity - this.passengerDestinationFloors.length;
  }

  private handleCurrentFloorDestinations(): void {
    const matchingPassengerDestinationFloors = pluckFromArray(
      this.passengerDestinationFloors,
      (passengerDestinationFloor) => passengerDestinationFloor === this.currentFloor
    );
    if (matchingPassengerDestinationFloors.length) this.stoppedAtCurrentFloor = true;
  }

  private handleCurrentFloorRequests(): void {
    const currentFloorRequestQueue = this.floorRequestQueues[this.currentFloor];
    if (!currentFloorRequestQueue.length) return;

    const remainingLiftCapacity = this.remainingLiftCapacity;
    if (!remainingLiftCapacity) {
      if (this.hasCurrentFloorRequestsDestinationsAhead) this.stoppedAtCurrentFloor = true;
      return;
    }

    const pluckedFloorRequests = pluckFromArray(
      currentFloorRequestQueue,
      this.direction === 1
        ? (floorRequest, arr, removed) =>
            removed.length >= remainingLiftCapacity ? false : floorRequest > this.currentFloor
        : (floorRequest, arr, removed) =>
            removed.length >= remainingLiftCapacity ? false : floorRequest < this.currentFloor
    );

    if (pluckedFloorRequests.length) {
      this.passengerDestinationFloors.push(...pluckedFloorRequests);
      this.stoppedAtCurrentFloor = true;
    }

    if (!currentFloorRequestQueue.length) this.floorsWithRequests.delete(this.currentFloor);
  }

  private handleCurrentFloor() {
    this.handleCurrentFloorDestinations();
    this.handleCurrentFloorRequests();
  }

  private get hasPassengerDestinationsAhead() {
    return this.passengerDestinationFloors.some(
      this.direction === 1
        ? (destinationFloor) => destinationFloor > this.currentFloor
        : (destinationFloor) => destinationFloor < this.currentFloor
    );
  }

  private get hasCurrentFloorRequestsDestinationsAhead() {
    return this.floorRequestQueues[this.currentFloor].some(
      this.direction === 1
        ? (floorRequest) => floorRequest > this.currentFloor
        : (floorRequest) => floorRequest < this.currentFloor
    );
  }

  private get hasFloorRequestsAhead() {
    return Array.from(this.floorsWithRequests).some(
      this.direction === 1
        ? (floor) => floor > this.currentFloor
        : (floor) => floor < this.currentFloor
    );
  }

  private updateDirection() {
    if (this.hasPassengerDestinationsAhead) return;
    if (this.hasFloorRequestsAhead) return;
    this.direction = this.direction === 1 ? -1 : 1;
  }

  private move() {
    while (!this.isLiftEmpty || this.floorsWithRequests.size) {
      this.handleCurrentFloor();

      const previousStop = this.liftStops[this.liftStops.length - 1];
      if (this.stoppedAtCurrentFloor) {
        if (previousStop !== this.currentFloor) this.liftStops.push(this.currentFloor);
        this.stoppedAtCurrentFloor = false;
      }

      const currentDirection = this.direction;
      this.updateDirection();
      if (this.direction === currentDirection) this.currentFloor += this.direction;
    }

    if (this.currentFloor !== 0) {
      this.currentFloor = 0;
      this.liftStops.push(this.currentFloor);
    }
  }
}

export const theLift = (queues: number[][], capacity: number): number[] => {
  const lift = new Lift(capacity, queues);
  lift.start();

  return lift.liftStops;
};
