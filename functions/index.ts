interface Env {
  BDC_API_KEY: string
}

interface BDCCarrier {
  asnNumeric: number
}

interface BDCResponse {
  network: {
    carriers: BDCCarrier[]
  }
}

const supportedUniversities = [
  'https://eecs.mit.edu',
  'https://eecs.berkeley.edu',
  'https://cs.stanford.edu',
  'https://cs.illinois.edu',
  'https://cs.cmu.edu',
]

const asnToRedirect: { [key: number]: string } = {
  3: 'https://eecs.mit.edu',
  9: 'https://cs.cmu.edu',
  25: 'https://eecs.berkeley.edu',
  32: 'https://cs.stanford.edu',
  38: 'https://cs.illinois.edu',
  698: 'https://cs.illinois.edu',
  1224: 'https://cs.illinois.edu',
  40387: 'https://cs.illinois.edu',
  46749: 'https://cs.stanford.edu',
  46750: 'https://cs.stanford.edu',
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  try {
    const callerIp = context.request.headers.get('cf-connecting-ip')

    const response = await fetch(`https://api.bigdatacloud.net/data/ip-geolocation?key=${context.env.BDC_API_KEY}&ip=${callerIp}`)
    const data: BDCResponse = await response.json()
    const via = data.network.carriers

    for (const carrier of via) {
      if (asnToRedirect[carrier.asnNumeric]) {
        return Response.redirect(asnToRedirect[carrier.asnNumeric], 307)
      }
    }
  } catch (e) {
    console.error(e)
    return Response.redirect(supportedUniversities[~~(Math.random() * supportedUniversities.length)], 307)
  }

  return Response.redirect(supportedUniversities[~~(Math.random() * supportedUniversities.length)], 307)
}