import Link from "next/link";

interface LoginLinkProps {
  text?: string;
  linkText?: string;
  href?: string;
}

export function LoginLink({
  text = "Sudah punya akun?",
  linkText = "Masuk di sini",
  href = "/login"
}: LoginLinkProps) {
  return (
    <div className="text-center">
      <span className="text-sm text-gray-600">
        {text}{" "}
        <Link
          href={href}
          className="font-medium text-emerald-600 hover:text-emerald-500 transition-colors"
        >
          {linkText}
        </Link>
      </span>
    </div>
  );
}