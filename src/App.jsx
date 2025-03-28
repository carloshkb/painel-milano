import { useEffect, useState } from "react";
import { Card, CardContent } from "./components/ui/card";
import { SpeakerLoud, SatelliteDish, Gauge, Zap } from "lucide-react";
import useSound from "use-sound";
import alertSound from "./assets/milano-alert.mp3";

export default function MilanoPainel() {
  const [status, setStatus] = useState("Desconhecido");
  const [bestDiff, setBestDiff] = useState(0);
  const [blockHeight, setBlockHeight] = useState("-");
  const [lastStatus, setLastStatus] = useState(null);
  const [play] = useSound(alertSound);

  const apiUrl = "https://api.public-pool.io/v1/address/3NFe86RpXeSL5uENUKPBnzMxceDbAnGgjU";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(apiUrl);
        const data = await res.json();

        if (data.status !== lastStatus) {
          setLastStatus(data.status);
          play();
        }

        setStatus(data.status);
        setBestDiff(data.bestDifficulty);
        setBlockHeight(data.blockHeight);
      } catch (error) {
        setStatus("API OFFLINE");
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, [lastStatus, play]);

  return (
    <div className="min-h-screen bg-black text-white p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      <h1 className="text-3xl font-bold col-span-full text-center text-blue-400">
        🛸 Painel de Comando - Milano Miner
      </h1>

      <Card className="bg-gray-900 shadow-lg border-blue-500 border">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <SatelliteDish /> <span className="text-xl">Status:</span>
          </div>
          <p className="text-green-400 text-2xl mt-2">{status}</p>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 shadow-lg border-yellow-500 border">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Zap /> <span className="text-xl">Melhor Dificuldade:</span>
          </div>
          <p className="text-yellow-400 text-2xl mt-2">{bestDiff}</p>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 shadow-lg border-purple-500 border">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Gauge /> <span className="text-xl">Altura do Bloco:</span>
          </div>
          <p className="text-purple-400 text-2xl mt-2">{blockHeight}</p>
        </CardContent>
      </Card>

      <Card className="bg-gray-900 shadow-lg border-pink-500 border col-span-full">
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <SpeakerLoud /> <span className="text-xl">Frase do Comando:</span>
          </div>
          <p className="text-pink-400 text-xl mt-2 italic">
            {status === "online"
              ? "Estrela Alfa online e varrendo o universo por blocos valiosos!"
              : status === "API OFFLINE"
              ? "A Milano perdeu sinal. Reestabelecendo conexão estelar..."
              : "Aguardando sinal da base. Energia concentrada na mineração solo."}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
