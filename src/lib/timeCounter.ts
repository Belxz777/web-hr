export function calculateTimeLeft(created: string, hoursToAccomplish: number): string {
    const timestampWithoutZ = created.replace("Z", "");
    const timestamp = new Date(timestampWithoutZ);
    const localTime = timestamp
    const totalMilliseconds = hoursToAccomplish * 60 * 60 * 1000;
    const expirationDate = new Date(localTime.getTime() + totalMilliseconds);
    const timeDiff = expirationDate.getTime() -new Date().getTime();
    const hoursLeft = Math.floor(timeDiff / (1000 * 60 * 60));
    const minutesLeft = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));


    return `${hoursLeft}:${minutesLeft.toString().padStart(2, '0')}`;
}