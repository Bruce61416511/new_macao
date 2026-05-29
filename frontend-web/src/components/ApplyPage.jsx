import ApplyTopBar from './ApplyTopBar.jsx';
import ApplyWorkspace from './ApplyWorkspace.jsx';
import PageFooter from './PageFooter.jsx';

export default function ApplyPage() {
  return (
    <main className="min-h-screen bg-[#f8fbfb] bg-[url('/macau-page-bg.webp')] bg-cover bg-top bg-no-repeat pb-10">
      <ApplyTopBar />
      <ApplyWorkspace />
      <PageFooter maxWidthClass="max-w-[1290px]" />
    </main>
  );
}
