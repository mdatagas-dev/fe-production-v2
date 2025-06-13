import Link from "next/link";
export default function BtnDetail({ url }) {
  return (
    <Link href={url} className="btn btn-info">
      Detail
    </Link>
  );
}
