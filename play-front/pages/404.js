
import Link from 'next/link'
export default function Custom404() {
    return (
        <div className='notFound move'>
            <div>
                <h1>404</h1>
                <p>Page Not Found</p>
                <Link href={process.env.NEXT_PUBLIC_DOMAIN_URL}>Go Back</Link>
            </div>
        </div>
    )
}