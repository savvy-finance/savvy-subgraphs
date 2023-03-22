
class Pool {
   name: string;
   address: string;
 
   constructor(name: string, address: string) {
     this.name = name;
     this.address = address;
   }
 }

 export let AVAXPools: Pool[] = [
   new Pool('TJBTCbAVAX', '0xcCa0cfFBF97fB10B08c1703f1DDdcF7b48c69d69'),
   new Pool('TJAVAXUSDC', '0xB5352A39C11a81FE6748993D586EC448A01f08b5'),
   new Pool('TJJOEAVAX', '0xc01961EdE437Bf0cC41D064B1a3F6F0ea6aa2a40'),
   new Pool('TJAVAXUSDT', '0xdF3E481a05F58c387Af16867e9F5dB7f931113c9'),
   new Pool('TJsAVAXAVAX', '0xA7687BE7174721178CFD7AA1AE590209649FC0b8'),
 ];