export default function Pagination({ currentPage, totalPage, onPageChange }) {
  const generatePageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPage, start + maxVisible - 1);
    if (end - start < maxVisible - 1) {
      start = Math.max(1, end - maxVisible + 1);
    }
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }
    return pages;
  };
  const pageNumbers = generatePageNumbers();
  return (
    <div className="join mt-4">
      {/* Tombol Sebelumnya */}
      <button
        className="join-item btn"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
      >
        «
      </button>

      {/* Nomor Halaman */}
      {pageNumbers.map((page) => (
        <button
          key={page}
          className={`join-item btn ${
            page === currentPage ? "btn-active" : ""
          }`}
          onClick={() => onPageChange(page)}
        >
          {page}
        </button>
      ))}

      {/* Tambahan ... dan halaman terakhir jika belum terlihat */}
      {pageNumbers[pageNumbers.length - 1] < totalPage && (
        <>
          <button className="join-item btn btn-disabled">...</button>
          <button
            className="join-item btn"
            onClick={() => onPageChange(totalPage)}
          >
            {totalPage}
          </button>
        </>
      )}

      {/* Tombol Selanjutnya */}
      <button
        className="join-item btn"
        disabled={currentPage === totalPage}
        onClick={() => onPageChange(currentPage + 1)}
      >
        »
      </button>
    </div>
  );
}
