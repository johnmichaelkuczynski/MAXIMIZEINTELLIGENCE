import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Zap, Loader2, Download, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface IncreaseIntelligenceButtonProps {
  originalText: string;
  provider?: string;
  className?: string;
}

const IncreaseIntelligenceButton: React.FC<IncreaseIntelligenceButtonProps> = ({
  originalText,
  provider = "zhi2",
  className = ""
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showResultsModal, setShowResultsModal] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const handleIncreaseIntelligence = async () => {
    if (!originalText || !originalText.trim()) {
      toast({
        title: "No text provided",
        description: "Please provide text to expand.",
        variant: "destructive"
      });
      return;
    }

    setIsProcessing(true);
    try {
      const response = await fetch('/api/increase-intelligence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: originalText,
          provider
        })
      });

      if (!response.ok) {
        throw new Error(`Request failed: ${response.statusText}`);
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.message || "Intelligence increase failed");
      }

      setResult(data.result);
      setShowResultsModal(true);
      
      toast({
        title: "Intelligence increased successfully",
        description: `Expanded ${data.result.originalWordCount} words → ${data.result.expandedWordCount} words (${data.result.expansionRatio.toFixed(1)}x)`
      });
      
    } catch (error) {
      console.error('Increase intelligence error:', error);
      toast({
        title: "Intelligence increase failed",
        description: error instanceof Error ? error.message : "Unknown error occurred",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCopy = () => {
    if (result?.expandedText) {
      navigator.clipboard.writeText(result.expandedText);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Expanded text copied successfully"
      });
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    if (!result) return;
    
    const content = `INTELLIGENCE INCREASE RESULTS
${"=".repeat(60)}

EXPANSION RATIO: ${result.expansionRatio.toFixed(2)}x
ORIGINAL: ${result.originalWordCount} words
EXPANDED: ${result.expandedWordCount} words

ORIGINAL TEXT:
${result.originalText}

${"=".repeat(60)}

EXPANDED TEXT (WITH EMPIRICAL GROUNDING & EXPLICIT REASONING):
${result.expandedText}

${"=".repeat(60)}
Provider: ${result.provider}
Generated: ${new Date().toLocaleString()}`;
    
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `intelligence-increase-${Date.now()}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <>
      <Button
        onClick={handleIncreaseIntelligence}
        disabled={isProcessing || !originalText.trim()}
        className={`flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white ${className}`}
        size="sm"
        data-testid="button-increase-intelligence"
      >
        {isProcessing ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Expanding...
          </>
        ) : (
          <>
            <Zap className="h-4 w-4" />
            Increase Intelligence
          </>
        )}
      </Button>

      <Dialog open={showResultsModal} onOpenChange={setShowResultsModal}>
        <DialogContent className="max-w-5xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Zap className="h-6 w-6 text-purple-600" />
              Intelligence Increase Results
            </DialogTitle>
            <DialogDescription>
              Text expanded with empirical grounding, explicit reasoning, and citation of real research
            </DialogDescription>
          </DialogHeader>

          {result && (
            <div className="space-y-6">
              {/* Expansion Stats */}
              <div className="bg-purple-50 dark:bg-purple-900/20 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 dark:text-purple-200 mb-3">Expansion Statistics</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{result.originalWordCount}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Original Words</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      {result.expansionRatio.toFixed(1)}x
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Expansion Ratio</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-700 dark:text-gray-300">{result.expandedWordCount}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">Expanded Words</div>
                  </div>
                </div>
              </div>

              {/* Expanded Text */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-semibold text-lg">Expanded Text (With Empirical Grounding)</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCopy}
                    className="flex items-center gap-1"
                  >
                    {copied ? (
                      <>
                        <Check className="h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <div className="border rounded-lg p-4 bg-gray-50 dark:bg-gray-800 max-h-96 overflow-y-auto">
                  <p className="whitespace-pre-wrap leading-relaxed">{result.expandedText}</p>
                </div>
              </div>

              {/* Original Text for Comparison */}
              <div>
                <h3 className="font-semibold mb-2">Original Text (For Comparison)</h3>
                <div className="border rounded-lg p-4 bg-gray-100 dark:bg-gray-900 max-h-40 overflow-y-auto">
                  <p className="whitespace-pre-wrap text-sm text-gray-600 dark:text-gray-400">{result.originalText}</p>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Download Results
            </Button>
            <Button
              onClick={() => setShowResultsModal(false)}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default IncreaseIntelligenceButton;
