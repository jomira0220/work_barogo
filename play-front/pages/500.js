
import Link from 'next/link'
export default function Custom500() {
    return (
        <div className='notFound move'>
            <div>
                <h1>500</h1>
                <p>Internal Server Error</p>
                <Link href={process.env.NEXT_PUBLIC_DOMAIN_URL}>Go Back</Link>
            </div>
        </div>
    )
}