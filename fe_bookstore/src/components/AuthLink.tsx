import { Link } from "react-router-dom";

interface AuthLinkProps {
  to: string;
  text: string;
  actionText: string;
}

export default function AuthLink({ to, text, actionText }: AuthLinkProps) {
  return (
    <p className="text-sm text-gray-500 text-center mt-4">
      {text}{" "}
      <Link to={to} className="text-indigo-600 font-medium hover:underline">
        {actionText}
      </Link>
    </p>
  );
}
