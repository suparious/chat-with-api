import EconomyDataQueryForm from '../components/EconomyDataQueryForm';
import Layout from '../components/Layout';

export default function QueryPage() {
    return (
        <Layout>
            <h1>Query the US Economy Data</h1>
            <EconomyDataQueryForm />
        </Layout>
    );
}