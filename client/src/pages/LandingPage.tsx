import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import { ArrowRight, Shield, Award, FlameKindling, Vote, Fingerprint } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-900 text-white">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-6xl font-bold leading-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-primary-100 to-white">
                  Own Your Identity.
                </span>
                <br />
                <span className="text-primary-300">Contribute.</span>
                <br />
                <span className="text-primary-200">Earn Trust.</span>
              </h1>
              <p className="text-xl md:text-2xl text-primary-100 max-w-xl">
                Secure, non-transferable NFT-based identity system with contribution tracking and DAO governance.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/dashboard">
                  <Button size="lg" className="font-semibold">
                    Connect Wallet
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
                <Link href="/nft">
                  <Button size="lg" variant="outline" className="font-semibold border-white/30 hover:bg-white/10">
                    Join Community
                  </Button>
                </Link>
              </div>
            </div>
            <div className="hidden md:flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary-500/40 to-primary-900/40 rounded-lg backdrop-blur-sm rotate-6 scale-105"></div>
                <div className="relative bg-white/10 backdrop-blur-md border border-primary-300/30 p-6 rounded-lg shadow-2xl">
                  <div className="w-72 h-96 bg-gradient-to-br from-primary-800 to-primary-950 rounded-lg overflow-hidden">
                    <div className="h-1/2 p-6 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-gradient-to-br from-primary-100 to-primary-300 flex items-center justify-center">
                        <Fingerprint className="w-14 h-14 text-primary-900" />
                      </div>
                    </div>
                    <div className="h-1/2 bg-gradient-to-t from-black/50 via-black/30 to-transparent p-6">
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <h3 className="text-lg font-bold text-white">FirstStepAI SoulID</h3>
                          <span className="px-2 py-1 rounded-full bg-primary-500/20 text-primary-200 text-xs">
                            #FSAI0721
                          </span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-primary-100 text-sm">Trust Score: 89</p>
                          <div className="w-full h-2 bg-primary-950 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-primary-300 to-primary-500 rounded-full" style={{ width: "89%" }}></div>
                          </div>
                        </div>
                        <p className="text-primary-200 text-xs">
                          Non-transferable digital identity for the FirstStepAI ecosystem
                        </p>
                        <div className="pt-2 flex gap-2">
                          {[1, 2, 3].map((i) => (
                            <span key={i} className="block w-6 h-6 rounded-full bg-primary-400/20 flex items-center justify-center">
                              <Award className="w-3 h-3 text-primary-200" />
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-slate-50 dark:bg-slate-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Key Features</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Our Web3 identity system combines the best of blockchain technology with modern identity practices
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Fingerprint className="w-10 h-10 text-primary-500" />}
              title="Soul-Bound NFTs"
              description="Non-transferable NFTs that represent your unique digital identity in the FirstStepAI ecosystem"
            />
            <FeatureCard
              icon={<FlameKindling className="w-10 h-10 text-amber-500" />}
              title="Flame Log"
              description="Track your contributions and earn recognition through our innovative trust scoring system"
            />
            <FeatureCard
              icon={<Vote className="w-10 h-10 text-emerald-500" />}
              title="DAO Governance"
              description="Participate in platform governance with weighted voting based on your trust score and reputation"
            />
          </div>
        </div>
      </section>

      {/* Trust System */}
      <section className="py-20 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-950">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <div className="bg-white dark:bg-slate-900 p-8 rounded-xl shadow-xl">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold flex items-center">
                      <Shield className="w-5 h-5 mr-2 text-primary-500" /> Trust Level 3
                    </h3>
                    <div className="w-full h-3 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-primary-400 to-primary-600 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400">65 / 100 points to next level</p>
                  </div>

                  <div className="space-y-4">
                    {[
                      { category: "Forum Contributions", points: 45, percentage: "70%" },
                      { category: "Community Events", points: 25, percentage: "40%" },
                      { category: "DAO Participation", points: 30, percentage: "50%" },
                    ].map((item, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex justify-between text-sm">
                          <span>{item.category}</span>
                          <span className="font-medium">{item.points} pts</span>
                        </div>
                        <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary-500/70 rounded-full"
                            style={{ width: item.percentage }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="pt-4 flex gap-3">
                    {["Early Adopter", "Forum Contributor", "Governance"].map((badge, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-800 dark:bg-primary-900/30 dark:text-primary-300"
                      >
                        <Award className="w-3 h-3 mr-1" />
                        {badge}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="order-1 md:order-2 space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Trust-Based Reputation System</h2>
              <p className="text-slate-600 dark:text-slate-400">
                Our innovative trust scoring system rewards your contributions to the FirstStepAI ecosystem,
                unlocking new privileges and recognition as you participate.
              </p>
              <ul className="space-y-3">
                {[
                  "Earn points through community engagement and contributions",
                  "Level up your trust score to unlock new badges and privileges",
                  "Gain voting power in the DAO governance system",
                  "Build a verifiable reputation that's tied to your Soul ID NFT",
                ].map((item, i) => (
                  <li key={i} className="flex items-start">
                    <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400 flex items-center justify-center mt-0.5 mr-3">
                      {i + 1}
                    </span>
                    <span className="text-slate-700 dark:text-slate-300">{item}</span>
                  </li>
                ))}
              </ul>
              <div>
                <Link href="/flame-log">
                  <Button className="mt-4">
                    Explore Flame Log
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DAO Section */}
      <section className="py-20 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Community Governance</h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Shape the future of FirstStepAI through our decentralized governance system
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-slate-50 dark:bg-slate-800 p-8 rounded-xl shadow-md">
              <h3 className="text-2xl font-bold mb-6">Active Proposals</h3>
              <div className="space-y-6">
                {[
                  {
                    title: "Increase Badge Requirements",
                    description: "Proposal to increase the point requirements for earning badges to encourage more participation",
                    votes: { for: 24, against: 8 },
                    endDate: "2025-04-19",
                  },
                  {
                    title: "Add New Badge Categories",
                    description: "Proposal to add new badge categories for technical mentorship and community growth initiatives",
                    votes: { for: 32, against: 2 },
                    endDate: "2025-04-20",
                  },
                ].map((proposal, i) => (
                  <div key={i} className="border-b border-slate-200 dark:border-slate-700 pb-6 last:border-0 last:pb-0">
                    <h4 className="text-lg font-semibold mb-2">{proposal.title}</h4>
                    <p className="text-slate-600 dark:text-slate-400 text-sm mb-3">
                      {proposal.description}
                    </p>
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-4">
                        <span className="inline-flex items-center text-sm text-green-600 dark:text-green-400">
                          <span className="font-medium">{proposal.votes.for}</span>
                          <span className="ml-1">For</span>
                        </span>
                        <span className="inline-flex items-center text-sm text-red-600 dark:text-red-400">
                          <span className="font-medium">{proposal.votes.against}</span>
                          <span className="ml-1">Against</span>
                        </span>
                      </div>
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        Ends: {proposal.endDate}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 text-center">
                <Link href="/dao">
                  <Button>
                    View All Proposals
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </div>
            </div>

            <div className="flex flex-col justify-center space-y-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-bold">How DAO Governance Works</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Our decentralized autonomous organization gives you a voice in shaping the future of FirstStepAI.
                </p>
                <ul className="space-y-4">
                  {[
                    {
                      title: "Proposal Creation",
                      description: "Any member with a trust score above 25 can create proposals for community consideration"
                    },
                    {
                      title: "Voting Power",
                      description: "Your voting power is determined by your trust level and contribution history"
                    },
                    {
                      title: "Execution",
                      description: "Approved proposals are automatically queued for execution after the voting period"
                    },
                  ].map((item, i) => (
                    <li key={i} className="bg-slate-100 dark:bg-slate-800/60 p-4 rounded-lg">
                      <h4 className="font-medium mb-1">{item.title}</h4>
                      <p className="text-sm text-slate-600 dark:text-slate-400">{item.description}</p>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-primary-50 dark:bg-primary-900/20 p-4 rounded-lg border border-primary-100 dark:border-primary-800/30">
                <p className="text-sm text-primary-800 dark:text-primary-300 italic">
                  "The FirstStepAI DAO allows us to collectively make decisions about our community's future, ensuring that everyone's voice is heard based on their contribution level."
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary-800 via-primary-900 to-primary-950 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Join FirstStepAI?</h2>
          <p className="text-primary-100 max-w-2xl mx-auto mb-10">
            Take your first step into the future of decentralized identity and community governance
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" variant="default" className="font-semibold">
                Enter Dashboard
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/nft">
              <Button size="lg" variant="outline" className="font-semibold border-white/30 hover:bg-white/10">
                Explore Soul IDs
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

// Feature Card Component
function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <Card className="border-0 shadow-md hover:shadow-lg transition-shadow dark:bg-slate-900">
      <CardContent className="p-6">
        <div className="w-16 h-16 mb-4 bg-slate-100 dark:bg-slate-800 rounded-lg flex items-center justify-center">
          {icon}
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-slate-600 dark:text-slate-400">{description}</p>
      </CardContent>
    </Card>
  );
}