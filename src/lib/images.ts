/**
 * Central image manifest.
 *
 * Every placeholder image on the site is referenced from here, so swapping
 * artwork is a one-file job. Images come from two royalty-free sources:
 *   - Lummi (https://www.lummi.ai): AI-generated stock, served by asset hash.
 *   - Pexels (https://www.pexels.com): real Greek/Cretan photography, by id.
 *
 * To replace an image: paste a new Lummi hash, a `px('<pexels-id>')` call,
 * or drop a file into /public/images and point the value at "/images/file.jpg".
 */

const CDN = 'https://assets.lummi.ai/assets';

/** Build a full Pexels CDN url (width is added later by `lummi`). */
const px = (id: string) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg`;

/** Build an image url at a given width, whatever the source. */
export function lummi(src: string, w = 1600): string {
  if (src.startsWith('/')) return src; // local /public asset
  if (src.startsWith('http')) {
    // Pexels resizes on the fly via query params; other urls pass through.
    if (src.includes('images.pexels.com')) {
      // auto=compress,format lets the CDN serve AVIF/WebP by content negotiation.
      return `${src}${src.includes('?') ? '&' : '?'}auto=compress,format&cs=tinysrgb&w=${w}`;
    }
    return src;
  }
  return `${CDN}/${src}?auto=format&w=${w}`;
}

export const IMG = {
  heroDark: px('13075811'), // dramatic dusk over dark Aegean mountains (night)
  heroLight: px('6507846'), // Santorini infinity pool over the caldera (day)
  intro: 'QmP5cnSMtCiFvAXL9BzYifdZZu37gPC8AxqxScRdtesDy5', // cliffside modern house, sea view
  lobby: 'QmNUqHS3WF8m92QwQUeSG9QsSGzA59TFtjieAFWxPbTSeQ', // elegant hotel lobby

  rooms: {
    deluxe: 'QmU58TV5qW7yzkF2ucpnCQD7pWMBYFfEt53o84Wr69RrAN', // ocean view room
    junior: 'QmchFPdBkd1VMXLWrtvxDvDHGaScRhfuSthxhQHHSHbe4Y', // ocean view room II
    bungalow: 'Qma6MiMhYJN223Cz6jauTaM2tM8KfVi2hX2uVLk8322EGi', // beachfront oasis
    villa: 'QmfS3EY3Cy1yRkzN2pgvCCqHZuUoCwspxisxtPiGeabXbp', // serene pool & sea
  },

  dining: {
    overview: 'QmdYu3QY9Kw4aZy5krj1FkK5ATAsqko3pC4ZuGTkzBprbM', // oceanfront lounge
    ostria: 'QmRMNiWhgGD229E1CEWNQV2wb8soD3gCXQ3jqmLYFhFDsZ', // sophisticated dining setting
    kyma: px('38313075'), // Cretan seaside taverna, colourful chairs, bay view
    umi: 'QmVqiEXt5RX8U7Wno1anFmWCm6ioUCbbf7PsnrwU5CprLo', // sushi plate
    meltemi: 'QmbQ2aMvdJ2AKzWxKns8YzTU6YWtCsdND8buDRtdF8itbF', // upscale golden lounge
    aegli: 'QmbzZ596ECiZWhybqBuKf3rKo6nXEfTaBkoZVqU459ApYn', // poolside retreat
  },

  spa: {
    hero: 'QmVeCuWNg3FkKMQktJfEpe5UMdGxLz1wnfy8vT5NHTVuXw', // serene spa room
    lounge: 'QmTqAeDaqNCzo9VT696Uo24XFaxr1xKLvSdKssYSveF2Y8', // luxurious spa lounge
    outdoor: 'QmU3dCj4YZvgD8NeKc334ADBYwHpLpNmk6FpEBZDsrmHMy', // serene outdoor spa
  },

  experiences: {
    hero: px('4808270'), // Cretan coast bay at golden hour
    sailing: px('9717862'), // sailboat moored in a calm Greek bay
    hiking: px('17603759'), // hikers in the Samaria Gorge, Crete
    overland: px('4370883'), // winding hairpin mountain road from above
    kayak: px('5142210'), // paddling on clear turquoise water
    coves: px('14017972'), // Seitan Limania, hidden turquoise cove
    village: px('33454816'), // whitewashed village lane with bougainvillea
  },

  testimonials: {
    hero: px('13650584'), // Santorini terrace with sea view
    weber: px('3290499'),
    rossi: px('6605420'),
    okafor: px('3868929'),
    adler: px('8422370'),
    martin: px('36763563'),
    sullivan: px('907862'),
  },

  gallery: [
    'QmYVwWrjSEzhQCegCqhB89d9ejLHEHzNwwegxpQ298KMYF', // infinity pool & ocean
    'QmbByAMUn2SN2LkgKW5XzSrfV8hkZsNkPS4JqFgViPLtQ4', // serene coastal scene
    px('34228247'), // Balos lagoon, Crete, turquoise beach
    'QmazuCcVoRX6HfmLEdSxjaYirgsyWVR7irfHhfA1KhPmbB', // sunset at infinity pool
    'QmcFWkYCVFkw4JCsug1eHbxQVkqTvRERABSzStXy6DTnjw', // luxurious modern interior
    'QmPL2wdLZiQJ5XJzTrBWRjJUPDnsXQuYKg5h661mbzU7wV', // modern infinity pool scene
    'QmPLn3FXD3YHkwJQt5pKsCQebLYGcEZRhJE4TbD4aGZiZ4', // luxurious marble interior
    'QmP2xaWpNtgcSbBwj7iVWVPnHDDR4wSStgKTSuXpGpxZ2K', // serene spa room
  ],
} as const;
