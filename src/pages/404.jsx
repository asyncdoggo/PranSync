export default function Page_Not_Found() {
    return (
        // <div className='w-full'>
        //     Me is the page not found
        // </div> 

        <div className='flex flex-col items-center justify-center h-screen bg-green-500 text-white'>
            <h1 className='text-6xl font-bold'>404</h1>
            <p className='text-2xl mt-4'>Oops! Page not found.</p>
            <a href='/' className='mt-8 px-4 py-2 bg-white text-green-500 rounded-full font-bold text-xl hover:bg-green-200 transition-colors duration-300'>Go Home</a>
        </div>
    )
}