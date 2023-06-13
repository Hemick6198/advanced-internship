"use client";
/* eslint-disable @next/next/no-img-element */
import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import { IoDocumentTextSharp } from "react-icons/io5";
import { RiPlantFill } from "react-icons/ri";
import { FaHandshake, FaSpinner } from "react-icons/fa";
import { AiOutlineDown } from "react-icons/ai";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import createYearlySubscriptionCheckoutSession from "../stripe/createYearlySubscriptionCheckoutSession";
import createMonthlySubscriptionCheckoutSession from "../stripe/createMonthlySubscriptionCheckoutSession";
import SidebarSizingAndSearchBar from "../components/UI/SidebarSizingAndSearchbar";
import { AppDispatch, RootState } from "../store";
import { useDispatch, useSelector } from "react-redux";
import { initializeAuth } from "../utilities/authSlice";

function Page() {
  const [activePlan, setActivePlan] = useState<string>("yearly");
  const [expanded, setExpanded] = React.useState<string | false>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector((state: RootState) => state.auth.user);
  const uid = user?.uid;

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  const handleYearlyCheckout = () => {
    setIsLoading(true);
    if (uid) {
      createYearlySubscriptionCheckoutSession(uid);
    }
  };

  const handleMonthlyCheckout = () => {
    setIsLoading(true);
    if (uid) {
      createMonthlySubscriptionCheckoutSession(uid);
    }
  };

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handlePlanClick = (plan: string) => {
    setActivePlan(plan);
  };

  useEffect(() => {
    setExpanded("panel1");
  }, []);

  return (
    <>
      <div className="plan">
        <div className="plan__header--wrapper">
          <div className="plan__header">
            <div className="plan__title">
              Get unlimited access to many amazing books to read
            </div>
            <div className="plan__sub--title">
              Turn ordinary moments into amazing learning opportunities
            </div>
            <figure className="plan__img--mask">
              <img
                alt="pricing"
                src="https://summarist.vercel.app/_next/image?url=%2F_next%2Fstatic%2Fmedia%2Fpricing-top.4d86e93a.png&w=1080&q=75"
                decoding="async"
                data-nimg="1"
                loading="lazy"
                style={{ color: "transparent" }}
                width="860"
                height="722"
              />
            </figure>
          </div>
        </div>
        <div className="row">
          <div className="container">
            <div className="plan__features--wrapper">
              <div className="plan__features">
                <figure className="plan__features--icon">
                  <IoDocumentTextSharp />
                </figure>
                <div className="plan__features--text">
                  <b>Key ideas in few min</b> with many books to read
                </div>
              </div>
              <div className="plan__features">
                <figure className="plan__features--icon">
                  <RiPlantFill />
                </figure>
                <div className="plan__features--text">
                  <b>3 million</b> people growing with Summarist everyday
                </div>
              </div>
              <div className="plan__features">
                <figure className="plan__features--icon">
                  <FaHandshake />
                </figure>
                <div className="plan__features--text">
                  <b>Precise recommendations</b> collections curated by experts
                </div>
              </div>
            </div>
            <div className="section__title">Choose the plan that fits you</div>
            <div
              className={`plan__card ${
                activePlan === "yearly" ? "plan__card--active" : ""
              }`}
              onClick={() => handlePlanClick("yearly")}
            >
              <div className="plan__card--circle">
                <div
                  className={` ${
                    activePlan === "yearly" ? "plan__card--dot" : ""
                  }`}
                ></div>
              </div>
              <div className="plan__card--content">
                <div className="plan__card--title">Premium Plus Yearly</div>
                <div className="plan__card--price">$99.99/year</div>
                <div className="plan__card--text">
                  7-day free trial included
                </div>
              </div>
            </div>
            <div className="plan__card--separator">
              <div className="plan__separator">or</div>
            </div>
            <div
              className={`plan__card ${
                activePlan === "monthly" ? "plan__card--active" : ""
              }`}
              onClick={() => handlePlanClick("monthly")}
            >
              <div className="plan__card--circle">
                <div
                  className={` ${
                    activePlan === "monthly" ? "plan__card--dot" : ""
                  }`}
                ></div>
              </div>
              <div className="plan__card--content">
                <div className="plan__card--title">Premium Monthly</div>
                <div className="plan__card--price">$9.99/month</div>
                <div className="plan__card--text">No trial included</div>
              </div>
            </div>
            <div className="plan__card--cta">
              {activePlan === "yearly" ? (
                <>
                  <span className="btn--wrapper">
                    <button
                      className="btn"
                      style={{ width: "300px" }}
                      onClick={() => handleYearlyCheckout()}
                    >
                      {!isLoading ? (
                        <span>Start your free 7-day trial</span>
                      ) : (
                        <div className="log__in--spinner">
                          <FaSpinner />
                        </div>
                      )}
                    </button>
                  </span>
                  <div className="plan__disclaimer">
                    Cancel your trial at any time before it ends, and you won
                    {"'"}t be charged.
                  </div>
                </>
              ) : (
                <>
                  <span className="btn--wrapper">
                    <button
                      className="btn"
                      style={{ width: "300px" }}
                      onClick={() => handleMonthlyCheckout()}
                    >
                      {!isLoading ? (
                        <span>Start your first month</span>
                      ) : (
                        <div className="log__in--spinner">
                          <FaSpinner />
                        </div>
                      )}
                    </button>
                  </span>
                  <div className="plan__disclaimer">
                    30-day money back guarantee, no questions asked.
                  </div>
                </>
              )}
            </div>
            <div className="accordion-container">
              <div className="faq__wrapper">
                <Accordion
                  expanded={expanded === "panel1"}
                  onChange={handleChange("panel1")}
                >
                  <AccordionSummary
                    expandIcon={<AiOutlineDown />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography className="accordion__title">
                      How does the free 7-day trial work?
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography className="accordion__body">
                      Begin your complimentary 7-day trial with a Summarist
                      annual membership. You are under no obligation to continue
                      your subscription, and you will only be billed when the
                      trial period expires. With Premium access, you can learn
                      at your own pace and as frequently as you desire, and you
                      may terminate your subscription prior to the conclusion of
                      the 7-day free trial.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion
                  expanded={expanded === "panel2"}
                  onChange={handleChange("panel2")}
                >
                  <AccordionSummary
                    expandIcon={<AiOutlineDown />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                  >
                    <Typography className="accordion__title">
                      Can I switch subscriptions from monthly to yearly, or
                      yearly to monthly?
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography className="accordion__body">
                      While an annual plan is active, it is not feasible to
                      switch to a monthly plan. However, once the current month
                      ends, transitioning from a monthly plan to an annual plan
                      is an option.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion
                  expanded={expanded === "panel3"}
                  onChange={handleChange("panel3")}
                >
                  <AccordionSummary
                    expandIcon={<AiOutlineDown />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                  >
                    <Typography className="accordion__title">
                      What{"'"}s included in the Premium plan?
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography className="accordion__body">
                      Premium membership provides you with the ultimate
                      Summarist experience, including unrestricted entry to many
                      best-selling books high-quality audio, the ability to
                      download titles for offline reading, and the option to
                      send your reads to your Kindle.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
                <Accordion
                  expanded={expanded === "panel4"}
                  onChange={handleChange("panel4")}
                >
                  <AccordionSummary
                    expandIcon={<AiOutlineDown />}
                    aria-controls="panel2a-content"
                    id="panel2a-header"
                  >
                    <Typography className="accordion__title">
                      Can I cancel during my trial or subscription?
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography className="accordion__body">
                      You will not be charged if you cancel your trial before
                      its conclusion. While you will not have complete access to
                      the entire Summarist library, you can still expand your
                      knowledge with one curated book per day.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="not__visible">
        <SidebarSizingAndSearchBar />
      </div>
      <Footer />
    </>
  );
}

export default Page;
