export default function FormLine({ onSubmit }) {
  return (
    <div>
      <form action="" onSubmit={onSubmit} className="w-full flex gap-2">
        <input
          type="text"
          name="line"
          className="input"
          placeholder="Line"
          required
        />
        <button type="submit" className="btn btn-primary">
          Add
        </button>
      </form>
    </div>
  );
}
