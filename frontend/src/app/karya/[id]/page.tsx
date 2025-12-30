import ClientWrapper from "./ClientWrapper";

export async function generateStaticParams() {
    return [{ id: 'dummy' }];
}

export default function Page() {
    return <ClientWrapper />;
}