export default function Profile({ params }: { params: { username: string } }) {
  return (
    <main className="flex flex-1 px-7">
      <h2>Profile ({params.username})</h2>
    </main>
  );
}
