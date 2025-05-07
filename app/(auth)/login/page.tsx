import AuthForm from '@/app/components/auth/AuthForm'
import { login } from '../../../lib/actions/auth.actions'
import Image from 'next/image'

export default function LoginPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-white px-6 py-12">
      <div className="w-full max-w-md bg-white p-10 rounded-xl shadow-sm border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="mb-6">
            <Image 
              src="/images/logo.png" 
              alt="logo" 
              width={100} 
              height={100} 
              className="object-contain"
            />
          </div>
          <h1 className="text-2xl font-semibold text-gray-800">Welcome back</h1>
          <p className="mt-2 text-center text-gray-500 text-sm">
            Please enter your details to access your account
          </p>
        </div>
        <AuthForm />
      </div>
      {/* <p className="mt-8 text-center text-xs text-gray-500">
        Need help? <a href="#" className="text-blue-600 hover:text-blue-800">Contact support</a>
      </p> */}
    </div>
  )
}