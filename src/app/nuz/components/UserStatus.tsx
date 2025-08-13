'use client';

import { useAuth } from '../auth/AuthContext';
import Link from 'next/link';

export default function UserStatus() {
  const { user, isAuthenticated, signOut } = useAuth();

  return (
    <div className="fixed top-4 right-4 z-20">
      {isAuthenticated ? (
        <div className="flex items-center gap-3">
          <div className="bg-green-600 border-2 border-green-800 rounded-lg px-3 py-2 text-white text-sm font-bold">
            <span className="text-xs block">TRAINER</span>
            {user?.username}
          </div>
          <button
            onClick={signOut}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-3 rounded-lg border-2 border-red-800 hover:border-red-700 transition-colors text-sm"
          >
            LOGOUT
          </button>
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <div className="bg-yellow-600 border-2 border-yellow-800 rounded-lg px-3 py-2 text-white text-sm font-bold">
            <span className="text-xs block">GUEST</span>
            MODE
          </div>
          <Link
            href="/nuz/signin"
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-3 rounded-lg border-2 border-blue-800 hover:border-blue-700 transition-colors text-sm"
          >
            SIGN IN
          </Link>
        </div>
      )}
    </div>
  );
}
