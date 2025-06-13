import Link from "next/link";

export default function BtnBack({ url }) {
  return (
    <Link href={url} className="btn btn-warning w-fit">
      Back
    </Link>
  );
}
