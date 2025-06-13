import Link from "next/link";
export default function BtnEdit({ url }) {
  return (
    <Link href={url} className="btn btn-warning">
      Edit
    </Link>
  );
}
