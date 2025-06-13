import Link from "next/link";
export default function BtnCreate({ url }) {
  return (
    <Link href={url} className="btn btn-primary w-fit">
      Create
    </Link>
  );
}
