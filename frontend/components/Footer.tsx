export default function Footer() {
  return (
    <footer className="bg-gray-800 text-center py-6">
      <p className="text-gray-400">
        &copy; {new Date().getFullYear()} ProductivityMate. All rights reserved.
      </p>
    </footer>
  );
}
