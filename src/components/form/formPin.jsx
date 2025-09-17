"use client";
export default function FormPin({ onSubmit }) {
  return (
    <form action="" onSubmit={onSubmit} className="w-full flex gap-2">
      <input
        type="number"
        name="pin"
        className="input"
        maxLength={5}
        required
      />
      <input type="date" name="date" className="input" required />
      <button type="submit" className="btn btn-primary">
        Submit
      </button>
    </form>
  );
}
