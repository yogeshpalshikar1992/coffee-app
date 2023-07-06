import { Html, Head, Main, NextScript } from 'next/document'
import Link from 'next/link'

export default function Document() {
  return (
    <Html lang="en">
      <Head >
        <Link rel='preload' href='/fonts/IBMPlesSans-Bold.ttf' as='font' crossOrigin='anonymous'>
        </Link>
        <Link rel='preload' href='/fonts/IBMPlesSans-Regular.ttf' as='font' crossOrigin='anonymous'>
        </Link>
        <Link rel='preload' href='/fonts/IBMPlesSans-SemiBold.ttf' as='font' crossOrigin='anonymous'>
        </Link>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
